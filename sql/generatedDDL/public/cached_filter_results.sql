create table public.cached_filter_results
(
	id serial,
	filter_fk text
		constraint cached_filter_results_cached_filters_id_fk
			references public.cached_filters
				on delete cascade,
	data_fk text,
	constraint unique_cached_result
		unique (filter_fk, data_fk)
);

comment on column public.cached_filter_results.data_fk is 'foreign key to company number or another data sources primary key';

alter table public.cached_filter_results owner to "orange-pc";

grant insert, select, update on public.cached_filter_results to frontend;

grant insert, select, update on public.cached_filter_results to black;

