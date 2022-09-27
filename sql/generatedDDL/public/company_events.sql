create table public.company_events
(
	id text not null,
	company_number char(8),
	fields_changed jsonb,
	published timestamp
		constraint sensible_date
			check (published > '1700-01-01 00:00:00'::timestamp without time zone),
	captured timestamp default CURRENT_TIMESTAMP,
	event jsonb,
	new boolean,
	timepoint integer not null
		constraint company_events_pkey
			primary key
);

comment on constraint sensible_date on public.company_events is 'Check that the published date was not before the year 1700';

alter table public.company_events owner to cloudsqlsuperuser;

create index company_events_captured_idx
	on public.company_events (captured);

create index company_events_company_number_idx
	on public.company_events (company_number);

create index company_events_date_trunc_idx
	on public.company_events (date_trunc('minute'::text, captured));

create index company_events_date_trunc_idx1
	on public.company_events (date_trunc('day'::text, captured));

create index company_events_date_trunc_idx2
	on public.company_events (date_trunc('hour'::text, captured));

create index company_events_date_trunc_idx3
	on public.company_events (date_trunc('hour'::text, published));

create index company_events_date_trunc_idx4
	on public.company_events (date_trunc('day'::text, published));

create index company_events_date_trunc_idx5
	on public.company_events (date_trunc('minute'::text, published));

create index company_events_published_idx
	on public.company_events (published);

grant select on public.company_events to frontend;

grant insert, select on public.company_events to stream;

grant select on public.company_events to black;

