create table public.users
(
	id serial
		constraint users_pkey
			primary key,
	name varchar(255),
	email varchar(255),
	email_verified timestamp with time zone,
	image text,
	created_at timestamp with time zone default CURRENT_TIMESTAMP not null,
	updated_at timestamp with time zone default CURRENT_TIMESTAMP not null,
	name_updated timestamp default CURRENT_TIMESTAMP,
	uid uuid default gen_random_uuid(),
	role_code text default 'unpaid_user'::text not null
		constraint users_user_roles_code_fk
			references public.user_roles
				on update cascade on delete set default
);

alter table public.users owner to "orange-pc";

create unique index email
	on public.users (email);

create unique index users_uid_uindex
	on public.users (uid);

grant delete, insert, references, select, trigger, truncate, update on public.users to frontend;

grant delete, insert, references, select, trigger, truncate, update on public.users to black;

