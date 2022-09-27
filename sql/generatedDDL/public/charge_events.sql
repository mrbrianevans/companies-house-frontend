create table public.charge_events
(
	id text not null
		constraint charge_events_pk
			primary key,
	charge_code text,
	created_on date,
	delivered_on date,
	company_number char(8)
		constraint charge_events_companies_number_fk
			references public.companies,
	timepoint integer,
	published timestamp,
	status text,
	satisfied_on date,
	classification_description text,
	classification_type text,
	particulars_description text,
	particulars_type integer,
	persons_entitled text[],
	transactions jsonb[]
);

alter table public.charge_events owner to "orange-pc";

grant select on public.charge_events to frontend;

grant insert, select on public.charge_events to stream;

