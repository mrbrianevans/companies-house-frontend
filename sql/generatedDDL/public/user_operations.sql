create table public.user_operations
(
	code text not null
		constraint user_operations_pk
			primary key,
	name text not null,
	description text
);

alter table public.user_operations owner to "orange-pc";

