create materialized view public.list_accounts as
	SELECT a.company_number,
       a.end_date
FROM company_accounts a
GROUP BY a.company_number, a.end_date
ORDER BY a.end_date, a.company_number;

alter materialized view public.list_accounts owner to "orange-pc";

