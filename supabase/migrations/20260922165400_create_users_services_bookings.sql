-- Users, services, and bookings with FK relationships and RLS.
-- Passwords are stored hashed in auth.users, not in public.users.

create extension if not exists pgcrypto;

do $$
begin
	if not exists (
		select 1
		from pg_type
		where typname = 'user_role'
			and typnamespace = 'public'::regnamespace
	) then
		create type public.user_role as enum ('customer', 'admin');
	end if;

	if not exists (
		select 1
		from pg_type
		where typname = 'booking_status'
			and typnamespace = 'public'::regnamespace
	) then
		create type public.booking_status as enum (
			'pending',
			'confirmed',
			'cancelled',
			'completed'
		);
	end if;
end
$$;

create table if not exists public.users (
	user_id uuid primary key references auth.users (id) on delete cascade,
	name text not null,
	email text not null unique,
	phone text,
	role public.user_role not null default 'customer',
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

comment on table public.users is
	'Public user profiles. Authentication passwords live in auth.users.';

create table if not exists public.services (
	service_id uuid primary key default gen_random_uuid(),
	name text not null unique,
	description text not null,
	price numeric(10, 2) not null check (price >= 0),
	created_at timestamptz not null default now()
);

create table if not exists public.bookings (
	booking_id uuid primary key default gen_random_uuid(),
	user_id uuid not null
		references public.users (user_id) on delete cascade,
	service_id uuid not null
		references public.services (service_id) on delete restrict,
	description text,
	booking_date timestamptz not null default now(),
	status public.booking_status not null default 'pending',
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create index if not exists bookings_user_id_idx
	on public.bookings (user_id);

create index if not exists bookings_service_id_idx
	on public.bookings (service_id);

create index if not exists bookings_status_idx
	on public.bookings (status);

create or replace function public.set_updated_at ()
returns trigger
language plpgsql
as $$
begin
	new.updated_at = now();
	return new;
end;
$$;

drop trigger if exists users_set_updated_at on public.users;
create trigger users_set_updated_at
	before update on public.users
	for each row
	execute function public.set_updated_at();

drop trigger if exists bookings_set_updated_at on public.bookings;
create trigger bookings_set_updated_at
	before update on public.bookings
	for each row
	execute function public.set_updated_at();

create or replace function public.handle_new_user ()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
	insert into public.users (user_id, name, email, phone, role)
	values (
		new.id,
		coalesce(
			new.raw_user_meta_data ->> 'name',
			split_part(new.email, '@', 1)
		),
		new.email,
		new.raw_user_meta_data ->> 'phone',
		'customer'
	);

	return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
	after insert on auth.users
	for each row
	execute function public.handle_new_user();

create or replace function public.is_admin ()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
	select exists (
		select 1
		from public.users
		where user_id = auth.uid()
			and role = 'admin'
	);
$$;

alter table public.users enable row level security;
alter table public.services enable row level security;
alter table public.bookings enable row level security;

drop policy if exists users_select_own_or_admin on public.users;
create policy users_select_own_or_admin
	on public.users
	for select
	to authenticated
	using (user_id = auth.uid() or public.is_admin());

drop policy if exists users_update_own_or_admin on public.users;
create policy users_update_own_or_admin
	on public.users
	for update
	to authenticated
	using (user_id = auth.uid() or public.is_admin())
	with check (user_id = auth.uid() or public.is_admin());

drop policy if exists services_select_public on public.services;
create policy services_select_public
	on public.services
	for select
	to anon, authenticated
	using (true);

drop policy if exists services_write_admin on public.services;
create policy services_write_admin
	on public.services
	for all
	to authenticated
	using (public.is_admin())
	with check (public.is_admin());

drop policy if exists bookings_select_own_or_admin on public.bookings;
create policy bookings_select_own_or_admin
	on public.bookings
	for select
	to authenticated
	using (user_id = auth.uid() or public.is_admin());

drop policy if exists bookings_insert_own on public.bookings;
create policy bookings_insert_own
	on public.bookings
	for insert
	to authenticated
	with check (user_id = auth.uid() or public.is_admin());

drop policy if exists bookings_update_own_or_admin on public.bookings;
create policy bookings_update_own_or_admin
	on public.bookings
	for update
	to authenticated
	using (user_id = auth.uid() or public.is_admin())
	with check (user_id = auth.uid() or public.is_admin());

drop policy if exists bookings_delete_own_or_admin on public.bookings;
create policy bookings_delete_own_or_admin
	on public.bookings
	for delete
	to authenticated
	using (user_id = auth.uid() or public.is_admin());

insert into public.services (name, description, price)
values
	(
		'Landing Page',
		'A focused, high-converting single-page site for businesses, products, or campaigns — clean, modern, and fully responsive.',
		200
	),
	(
		'Static Website',
		'A professional multi-page website for businesses, portfolios, or organizations — fast, modern, and built to last.',
		300
	),
	(
		'Personal Website',
		'A personalized site for creators and professionals — designed to showcase your work, skills, and personal brand.',
		250
	)
on conflict (name) do update
set
	description = excluded.description,
	price = excluded.price;
