create table public.very_long_accounts
(
	company_number char(8) not null
		constraint accounts_company_number_fkey
			references public.companies,
	name text not null,
	label text,
	context_ref text not null,
	value text,
	start_date date,
	end_date date not null,
	unit text,
	decimals integer,
	captured timestamp default CURRENT_TIMESTAMP,
	constraint very_long_accounts_pkey
		primary key (company_number, name, end_date, context_ref)
);

alter table public.very_long_accounts owner to cloudsqlsuperuser;

grant select on public.very_long_accounts to black;

