create table public.legacy_accountants
(
	name text not null
		constraint accountants_pkey
			primary key,
	company_number char(8)
		constraint accountants_company_number_fkey
			references public.companies,
	software text[],
	number_of_clients integer
);

alter table public.legacy_accountants owner to cloudsqlsuperuser;

grant select on public.legacy_accountants to frontend;

grant select on public.legacy_accountants to black;

