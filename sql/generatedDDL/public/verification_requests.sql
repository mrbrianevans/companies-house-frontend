create table public.verification_requests
(
	id serial
		constraint verification_requests_pkey
			primary key,
	identifier varchar(255) not null,
	token varchar(255) not null,
	expires timestamp with time zone not null,
	created_at timestamp with time zone default CURRENT_TIMESTAMP not null,
	updated_at timestamp with time zone default CURRENT_TIMESTAMP not null
);

alter table public.verification_requests owner to "orange-pc";

create unique index token
	on public.verification_requests (token);

grant delete, insert, references, select, trigger, truncate, update on public.verification_requests to frontend;

grant delete, insert, references, select, trigger, truncate, update on public.verification_requests to black;

