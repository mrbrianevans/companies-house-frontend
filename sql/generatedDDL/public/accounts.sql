create table public.accounts
(
	id serial
		constraint accounts_pkey1
			primary key,
	compound_id varchar(255) not null,
	user_id integer not null,
	provider_type varchar(255) not null,
	provider_id varchar(255) not null,
	provider_account_id varchar(255) not null,
	refresh_token text,
	access_token text,
	access_token_expires timestamp with time zone,
	created_at timestamp with time zone default CURRENT_TIMESTAMP not null,
	updated_at timestamp with time zone default CURRENT_TIMESTAMP not null
);

alter table public.accounts owner to "orange-pc";

create unique index compound_id
	on public.accounts (compound_id);

create index provider_account_id
	on public.accounts (provider_account_id);

create index provider_id
	on public.accounts (provider_id);

create index user_id
	on public.accounts (user_id);

grant select on public.accounts to frontend;

grant delete, insert, references, select, trigger, truncate, update on public.accounts to black;

