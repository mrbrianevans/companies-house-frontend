create table public.psc_enumerations
(
	code text not null
		constraint psc_enumerations_pkey
			primary key,
	description text
);

alter table public.psc_enumerations owner to cloudsqlsuperuser;

grant select on public.psc_enumerations to black;

