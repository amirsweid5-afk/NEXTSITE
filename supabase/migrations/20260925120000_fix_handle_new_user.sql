-- Recreate the signup trigger and backfill profiles missing from auth.

create or replace function public.handle_new_user ()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
	insert into public.users (
		user_id,
		auth_user_id,
		name,
		email,
		phone,
		role
	)
	values (
		new.id,
		new.id,
		coalesce(
			nullif(new.raw_user_meta_data ->> 'name', ''),
			split_part(new.email, '@', 1)
		),
		new.email,
		nullif(new.raw_user_meta_data ->> 'phone', ''),
		'customer'
	)
	on conflict (email) do update
	set
		auth_user_id = excluded.auth_user_id,
		name = coalesce(
			nullif(public.users.name, ''),
			excluded.name
		);

	return new;
exception
	when unique_violation then
		update public.users
		set auth_user_id = new.id
		where email = new.email
			and (
				auth_user_id is null
				or auth_user_id = new.id
			);

		return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
	after insert on auth.users
	for each row
	execute function public.handle_new_user();

grant execute on function public.handle_new_user ()
	to supabase_auth_admin, postgres, service_role;

insert into public.users (
	user_id,
	auth_user_id,
	name,
	email,
	role
)
select
	auth_user.id,
	auth_user.id,
	coalesce(
		nullif(auth_user.raw_user_meta_data ->> 'name', ''),
		split_part(auth_user.email, '@', 1)
	),
	auth_user.email,
	'customer'
from auth.users as auth_user
where auth_user.email is not null
	and not exists (
		select 1
		from public.users as profile
		where profile.auth_user_id = auth_user.id
			or lower(profile.email) = lower(auth_user.email)
	);

update public.users as profile
set auth_user_id = auth_user.id
from auth.users as auth_user
where auth_user.email is not null
	and lower(profile.email) = lower(auth_user.email)
	and profile.auth_user_id is null;
