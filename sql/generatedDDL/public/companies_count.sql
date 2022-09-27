create materialized view public.companies_count as
	SELECT now()                 AS last_updated_count,
       (SELECT count(*) AS count
        FROM companies)      AS companies_rows,
       (SELECT count(DISTINCT filing_events.company_number) AS count
        FROM filing_events)  AS filing_events_companies,
       (SELECT count(DISTINCT company_events.company_number) AS count
        FROM company_events) AS company_events_companies,
       (SELECT count(DISTINCT filing_events.id) AS count
        FROM filing_events)  AS filing_events_ids,
       (SELECT count(DISTINCT company_events.id) AS count
        FROM company_events) AS company_events_ids,
       (SELECT count(*) AS count
        FROM filing_events)  AS filing_events_rows,
       (SELECT count(*) AS count
        FROM company_events) AS company_events_rows,
       (SELECT count(*) AS count
        FROM accounts)       AS accounts_rows,
       (SELECT count(DISTINCT accounts.company_number) AS count
        FROM accounts)       AS accounts_companies;

alter materialized view public.companies_count owner to "orange-pc";

grant select on public.companies_count to black;

