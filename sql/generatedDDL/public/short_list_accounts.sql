create materialized view public.short_list_accounts as
	SELECT a.company_number,
       a.end_date
FROM accounts a
WHERE a.label = 'UK Companies House registered number'::text
GROUP BY a.company_number, a.end_date
ORDER BY a.end_date, a.company_number;

alter materialized view public.short_list_accounts owner to "orange-pc";

create unique index short_list_accounts_company_number_end_date_idx
	on public.short_list_accounts (company_number, end_date);

grant select on public.short_list_accounts to black;

