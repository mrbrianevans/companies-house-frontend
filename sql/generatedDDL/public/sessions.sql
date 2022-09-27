create table public.sessions
(
	id serial
		constraint sessions_pkey
			primary key,
	user_id integer not null,
	expires timestamp with time zone not null,
	session_token varchar(255) not null,
	access_token varchar(255) not null,
	created_at timestamp with time zone default CURRENT_TIMESTAMP not null,
	updated_at timestamp with time zone default CURRENT_TIMESTAMP not null
);

alter table public.sessions owner to "orange-pc";

create unique index session_token
	on public.sessions (session_token);

create unique index access_token
	on public.sessions (access_token);

grant delete, insert, references, select, trigger, truncate, update on public.sessions to frontend;

grant delete, insert, references, select, trigger, truncate, update on public.sessions to black;

