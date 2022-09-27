create table public.sic
(
	company_number char(8) not null
		constraint sic_company_number_fkey
			references public.companies,
	sic_code varchar(5) not null
		constraint sic_sic_code_fkey
			references public.sic_map,
	constraint sic_pkey
		primary key (company_number, sic_code)
);

alter table public.sic owner to cloudsqlsuperuser;

create index sic_company_number_idx
	on public.sic (company_number);

create index sic_sic_code_idx
	on public.sic (sic_code);

grant select on public.sic to frontend;

grant select on public.sic to black;

