create table public.company_accounts
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
	constraint accounts_pkey
		primary key (company_number, name, end_date, context_ref),
	constraint short_label_and_value
		check ((length(label) + length(value)) < 2000)
);

alter table public.company_accounts owner to cloudsqlsuperuser;

create index accounts_company_number_index
	on public.company_accounts (company_number);

create index accounts_label_idx
	on public.company_accounts (label);

create index accounts_value_idx
	on public.company_accounts (value);

create index accounts_company_number_end_date_idx
	on public.company_accounts (company_number, end_date);

grant select on public.company_accounts to frontend;

grant select on public.company_accounts to black;

