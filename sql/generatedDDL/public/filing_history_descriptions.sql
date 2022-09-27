create table public.filing_history_descriptions
(
	key text not null
		constraint filing_history_descriptions_pkey
			primary key,
	value text
);

alter table public.filing_history_descriptions owner to cloudsqlsuperuser;

grant select on public.filing_history_descriptions to frontend;

grant select on public.filing_history_descriptions to stream;

grant select on public.filing_history_descriptions to black;

