create table public.sic_map
(
	code varchar(5) not null
		constraint sic_map_pkey
			primary key,
	description varchar(1000)
);

alter table public.sic_map owner to cloudsqlsuperuser;

grant select on public.sic_map to frontend;

grant select on public.sic_map to black;

