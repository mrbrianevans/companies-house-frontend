create table public.user_filters
(
	id serial
		constraint user_filters_pk
			primary key,
	title text,
	created timestamp default CURRENT_TIMESTAMP,
	user_id_fk integer
		constraint user_filters_users_id_fk
			references public.users
				on update cascade on delete cascade,
	cached_filter_fk text
		constraint user_filters_cached_filters_id_fk
			references public.cached_filters
				on update cascade on delete set null
);

comment on table public.user_filters is 'this table stores filters saved by a user to their account';

alter table public.user_filters owner to "orange-pc";

create unique index user_filters_unique_per_user
	on public.user_filters (cached_filter_fk, user_id_fk);

grant insert, select, update on public.user_filters to frontend;

grant insert, select, update on public.user_filters to black;

