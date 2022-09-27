create materialized view public.accountants as
	SELECT w1.accountants                    AS name_on_accounts,
       (WITH matching_numbers AS (
           SELECT companies.number
           FROM companies
           WHERE upper(companies.name::text) ~~ upper(w1.accountants || '%'::text)
       )
        SELECT CASE
                   WHEN count(*) = 1 THEN string_agg(matching_numbers.number::text, ''::text)
                   ELSE NULL::text
                   END AS company_number
        FROM matching_numbers)           AS company_number,
       (SELECT w2.accouting_software
        FROM wide_accounts_combined w2
        WHERE w1.accountants = w2.accountants
        GROUP BY w2.accouting_software
        ORDER BY (count(DISTINCT w2.company_number)) DESC
        LIMIT 1)                         AS software,
       count(DISTINCT w1.company_number) AS number_of_clients
FROM wide_accounts_combined w1
WHERE w1.accountants IS NOT NULL
GROUP BY w1.accountants;

alter materialized view public.accountants owner to "orange-pc";

create index trgm_idx_accountants_upper_name
	on public.accountants using gin (upper(name_on_accounts) gin_trgm_ops);

create index trgm_idx_accountants_lower_name
	on public.accountants using gin (lower(name_on_accounts) gin_trgm_ops);

create index trgm_idx_accountants_lower_software
	on public.accountants using gin (lower(software) gin_trgm_ops);

create index accountants_software_idx
	on public.accountants (software);

create index accountants_lower_idx
	on public.accountants (lower(software));

grant select on public.accountants to frontend;

