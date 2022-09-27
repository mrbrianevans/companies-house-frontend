create table public.user_roles
(
	code text not null
		constraint roles_pk
			primary key,
	name text not null,
	description text
);

alter table public.user_roles owner to "orange-pc";

grant select on public.user_roles to frontend;

