-- Per-booking project price and payment records for admin revenue tracking.
-- Revenue is derived only from booking_payments amounts (never unpaid balances).

alter table public.bookings
	add column if not exists price_usd numeric(10, 2);

do $$
begin
	if not exists (
		select 1
		from pg_constraint
		where conname = 'bookings_price_usd_check'
			and conrelid = 'public.bookings'::regclass
	) then
		alter table public.bookings
			add constraint bookings_price_usd_check
			check (price_usd is null or price_usd >= 0);
	end if;
end
$$;

comment on column public.bookings.price_usd is
	'Admin-set project price in USD for this booking.';

create table if not exists public.booking_payments (
	payment_id uuid primary key default gen_random_uuid(),
	booking_id uuid not null
		references public.bookings (booking_id) on delete cascade,
	amount_usd numeric(10, 2) not null
		check (amount_usd > 0),
	paid_at timestamptz not null default now(),
	note text,
	created_at timestamptz not null default now(),
	created_by uuid
		references auth.users (id) on delete set null
);

comment on table public.booking_payments is
	'Real customer payment records against bookings. Partial payments allowed.';

create index if not exists booking_payments_booking_id_idx
	on public.booking_payments (booking_id);

create index if not exists booking_payments_paid_at_idx
	on public.booking_payments (paid_at);

alter table public.booking_payments enable row level security;

drop policy if exists booking_payments_select_admin
	on public.booking_payments;
create policy booking_payments_select_admin
	on public.booking_payments
	for select
	to authenticated
	using (public.is_admin());

drop policy if exists booking_payments_insert_admin
	on public.booking_payments;
create policy booking_payments_insert_admin
	on public.booking_payments
	for insert
	to authenticated
	with check (public.is_admin());

drop policy if exists booking_payments_update_admin
	on public.booking_payments;
create policy booking_payments_update_admin
	on public.booking_payments
	for update
	to authenticated
	using (public.is_admin())
	with check (public.is_admin());

drop policy if exists booking_payments_delete_admin
	on public.booking_payments;
create policy booking_payments_delete_admin
	on public.booking_payments
	for delete
	to authenticated
	using (public.is_admin());

-- Keep existing update access; price changes are blocked for non-admins below.
drop policy if exists bookings_update_own_or_admin on public.bookings;
create policy bookings_update_own_or_admin
	on public.bookings
	for update
	to authenticated
	using (
		user_id = public.current_app_user_id()
		or public.is_admin()
	)
	with check (
		user_id = public.current_app_user_id()
		or public.is_admin()
	);

-- Non-admins cannot change price_usd (trigger guard).
create or replace function public.prevent_non_admin_price_change ()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
	if (
		new.price_usd is distinct from old.price_usd
		and not public.is_admin()
	) then
		raise exception 'Only admins can change booking prices';
	end if;

	return new;
end;
$$;

drop trigger if exists bookings_prevent_non_admin_price_change
	on public.bookings;
create trigger bookings_prevent_non_admin_price_change
	before update on public.bookings
	for each row
	execute function public.prevent_non_admin_price_change();

grant select, insert, update, delete
	on table public.booking_payments
	to authenticated;

-- Seed booking prices from the service catalog where still unset.
update public.bookings as booking
set price_usd = service.price
from public.services as service
where booking.service_id = service.service_id
	and booking.price_usd is null;

notify pgrst, 'reload schema';
