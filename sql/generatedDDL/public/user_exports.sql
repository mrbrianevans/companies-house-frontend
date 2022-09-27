create table public.user_exports
(
	id serial
		constraint user_exports_pk
			primary key,
	user_filter_fk integer
		constraint user_exports_user_filters_id_fk
			references public.user_filters
				on update cascade on delete set null,
	timestamp timestamp default CURRENT_TIMESTAMP,
	time_to_export integer,
	operation_code text
		constraint user_exports_user_operations_code_fk
			references public.user_operations
);

comment on column public.user_exports.time_to_export is 'milliseconds';

alter table public.user_exports owner to "orange-pc";

grant insert, select on public.user_exports to frontend;

grant insert, select, update on public.user_exports to black;

