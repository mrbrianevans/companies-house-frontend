create table public.filing_events_legacy
(
	id text not null,
	category text,
	description_code text
		constraint filing_events_description_code_fkey
			references public.filing_history_descriptions,
	description text,
	filing_date date,
	timepoint integer not null
		constraint filing_events_pkey
			primary key,
	published timestamp,
	captured timestamp default CURRENT_TIMESTAMP,
	barcode text,
	type text,
	company_number char(8)
);

alter table public.filing_events_legacy owner to cloudsqlsuperuser;

create index filing_events_captured_idx
	on public.filing_events_legacy (captured);

create index filing_events_company_number_idx
	on public.filing_events_legacy (company_number);

create index filing_events_date_trunc_idx
	on public.filing_events_legacy (date_trunc('minute'::text, captured));

create index filing_events_date_trunc_idx1
	on public.filing_events_legacy (date_trunc('hour'::text, captured));

create index filing_events_date_trunc_idx2
	on public.filing_events_legacy (date_trunc('day'::text, captured));

create index filing_events_date_trunc_idx3
	on public.filing_events_legacy (date_trunc('hour'::text, published));

create index filing_events_date_trunc_idx4
	on public.filing_events_legacy (date_trunc('day'::text, published));

create index filing_events_date_trunc_idx5
	on public.filing_events_legacy (date_trunc('minute'::text, published));

create index filing_events_published_idx
	on public.filing_events_legacy (published);

create index filing_events_description_code_idx
	on public.filing_events_legacy (description_code);

create index filing_events_filing_date_idx
	on public.filing_events_legacy (filing_date);

grant select on public.filing_events_legacy to black;

