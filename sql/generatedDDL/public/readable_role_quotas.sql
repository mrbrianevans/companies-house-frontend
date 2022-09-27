create view public.readable_role_quotas(role, operation, monthly_limit) as
	SELECT ur.name AS role,
       uo.name AS operation,
       urq.monthly_limit
FROM user_role_quotas urq
         JOIN user_operations uo ON urq.operation = uo.code
         JOIN user_roles ur ON ur.code = urq.role_code;

alter table public.readable_role_quotas owner to "orange-pc";

