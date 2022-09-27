create table public.user_role_quotas
(
	id serial
		constraint user_role_quotas_pk
			primary key,
	role_code text
		constraint user_role_quotas_user_roles_code_fk
			references public.user_roles
				on update cascade on delete cascade,
	operation text not null
		constraint user_role_quotas_user_operations_code_fk
			references public.user_operations
				on update cascade on delete cascade,
	monthly_limit integer not null,
	constraint unique_role_operation
		unique (role_code, operation)
);

comment on column public.user_role_quotas.operation is 'the operation that the quota restricts';

alter table public.user_role_quotas owner to "orange-pc";

grant select on public.user_role_quotas to frontend;

grant select on public.user_role_quotas to black;

