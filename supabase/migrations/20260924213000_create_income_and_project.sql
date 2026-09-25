-- Income and project tables for admin portal tracking.

do $$
begin
	if not exists (
		select 1
		from pg_type
		where typname = 'income_payment_method'
			and typnamespace = 'public'::regnamespace
	) then
		create type public.income_payment_method as enum (
			'cash',
			'card',
			'bank_transfer',
			'paypal',
			'other'
		);
	end if;

	if not exists (
		select 1
		from pg_type
		where typname = 'income_status'
			and typnamespace = 'public'::regnamespace
	) then
		create type public.income_status as enum (
			'pending',
			'completed',
			'failed',
			'refunded'
		);
	end if;

	if not exists (
		select 1
		from pg_type
		where typname = 'project_status'
			and typnamespace = 'public'::regnamespace
	) then
		create type public.project_status as enum (
			'planned',
			'in_progress',
			'on_hold',
			'completed',
			'cancelled'
		);
	end if;
end
$$;

create table if not exists public.income (
	income_id uuid primary key default gen_random_uuid(),
	amount numeric(12, 2) not null
		check (amount > 0),
	payment_date date not null default (timezone('utc', now()))::date,
	payment_method public.income_payment_method not null
		default 'other',
	payment_currency text not null default 'USD'
		check (char_length(trim(payment_currency)) between 3 and 3),
	status public.income_status not null default 'completed',
	notes text,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

comment on table public.income is
	'Standalone income / payment records for the admin portal.';

create index if not exists income_payment_date_idx
	on public.income (payment_date desc);

create index if not exists income_status_idx
	on public.income (status);

create index if not exists income_payment_method_idx
	on public.income (payment_method);

drop trigger if exists income_set_updated_at on public.income;
create trigger income_set_updated_at
	before update on public.income
	for each row
	execute function public.set_updated_at();

create table if not exists public.project (
	project_id uuid primary key default gen_random_uuid(),
	project_name text not null,
	client_name text not null,
	service_type text not null,
	description text,
	price numeric(12, 2) not null
		check (price >= 0),
	status public.project_status not null default 'planned',
	start_date date,
	deadline date,
	completed_at timestamptz,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now(),
	constraint project_deadline_after_start_check
		check (
			start_date is null
			or deadline is null
			or deadline >= start_date
		)
);

comment on table public.project is
	'Client website projects tracked in the admin portal.';

create index if not exists project_status_idx
	on public.project (status);

create index if not exists project_client_name_idx
	on public.project (client_name);

create index if not exists project_deadline_idx
	on public.project (deadline);

drop trigger if exists project_set_updated_at on public.project;
create trigger project_set_updated_at
	before update on public.project
	for each row
	execute function public.set_updated_at();

alter table public.income enable row level security;
alter table public.project enable row level security;

drop policy if exists income_select_admin on public.income;
create policy income_select_admin
	on public.income
	for select
	to authenticated
	using (public.is_admin());

drop policy if exists income_insert_admin on public.income;
create policy income_insert_admin
	on public.income
	for insert
	to authenticated
	with check (public.is_admin());

drop policy if exists income_update_admin on public.income;
create policy income_update_admin
	on public.income
	for update
	to authenticated
	using (public.is_admin())
	with check (public.is_admin());

drop policy if exists income_delete_admin on public.income;
create policy income_delete_admin
	on public.income
	for delete
	to authenticated
	using (public.is_admin());

drop policy if exists project_select_admin on public.project;
create policy project_select_admin
	on public.project
	for select
	to authenticated
	using (public.is_admin());

drop policy if exists project_insert_admin on public.project;
create policy project_insert_admin
	on public.project
	for insert
	to authenticated
	with check (public.is_admin());

drop policy if exists project_update_admin on public.project;
create policy project_update_admin
	on public.project
	for update
	to authenticated
	using (public.is_admin())
	with check (public.is_admin());

drop policy if exists project_delete_admin on public.project;
create policy project_delete_admin
	on public.project
	for delete
	to authenticated
	using (public.is_admin());

grant select, insert, update, delete
	on table public.income
	to authenticated;

grant select, insert, update, delete
	on table public.project
	to authenticated;

notify pgrst, 'reload schema';
