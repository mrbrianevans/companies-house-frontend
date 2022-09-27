create table public.cached_filters
(
	id text not null
		constraint cached_filters_id_pk
			primary key,
	last_viewed timestamp,
	view_count integer,
	created timestamp default CURRENT_TIMESTAMP,
	last_run timestamp,
	time_to_run integer[],
	filters jsonb[] not null,
	query text,
	category saved_filter_category,
	result_count integer
);

alter table public.cached_filters owner to "orange-pc";

grant insert, select, update on public.cached_filters to frontend;

grant insert, select, update on public.cached_filters to black;

