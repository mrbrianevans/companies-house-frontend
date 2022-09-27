create table public.saved_filters
(
	id text not null,
	last_viewed timestamp,
	view_count integer default 0,
	created timestamp default CURRENT_TIMESTAMP,
	last_run timestamp default CURRENT_TIMESTAMP,
	time_to_run integer[] default ARRAY[]::integer[],
	filters jsonb[],
	query text,
	results jsonb[],
	category saved_filter_category default 'ACCOUNTANT'::saved_filter_category not null,
	result_count integer,
	constraint saved_filters_pk
		primary key (id, category)
);

comment on column public.saved_filters.id is 'a hash of the filter object';

alter table public.saved_filters owner to "orange-pc";

grant delete, insert, references, select, trigger, truncate, update on public.saved_filters to frontend;

