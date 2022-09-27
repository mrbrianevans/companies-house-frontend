create table public.filing_events
(
	id text not null
		constraint filing_events_new_pkey
			primary key,
	category text,
	description_code text
		constraint filing_events_description_code_fkey
			references public.filing_history_descriptions,
	description text,
	description_values jsonb,
	filing_date date,
	timepoint integer,
	published timestamp
		constraint sensible_date
			check (published > '1700-01-01 00:00:00'::timestamp without time zone),
	captured timestamp default CURRENT_TIMESTAMP,
	barcode text,
	type text,
	company_number char(8)
);

comment on constraint sensible_date on public.filing_events is 'Check that the published date was not before the year 1700';

alter table public.filing_events owner to "orange-pc";

create index filing_events_description_code_idx1
	on public.filing_events using hash (description_code);

create index filing_events_filing_date_idx1
	on public.filing_events (filing_date);

create index filing_events_company_number_index
	on public.filing_events (company_number);

create index filing_events_timepoint_idx
	on public.filing_events (timepoint);

create index filing_events_expr_idx
	on public.filing_events ((description_values ->> 'officer_name'::text));

grant insert, select, update on public.filing_events to frontend;

grant insert, select on public.filing_events to stream;

grant delete, insert, references, select, trigger, truncate, update on public.filing_events to company_events_saver;

grant select on public.filing_events to events_freq_cloud_func;

