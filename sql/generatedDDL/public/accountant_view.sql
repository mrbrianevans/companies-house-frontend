create view public.accountant_view(name_on_accounts, company_number, software, number_of_clients, registered_name, streetaddress, county, area, country, postcode, company_type, country_of_origin, status, date_of_creation, balance_sheet_date, accountants, employees, current_assets, cash_at_bank, debtors, creditors, fixed_assets, net_assets, total_assets_less_current_liabilities, equity, revenue, profit, officers) as
	SELECT a.name_on_accounts,
       a.company_number,
       a.software,
       a.number_of_clients,
       c.name      AS registered_name,
       c.streetaddress,
       dp.county,
       dp.district AS area,
       dp.country,
       c.postcode,
       c.category  AS company_type,
       c.origin    AS country_of_origin,
       c.status,
       c.date      AS date_of_creation,
       wac.balance_sheet_date,
       wac.accountants,
       wac.employees,
       wac.current_assets,
       wac.cash_at_bank,
       wac.debtors,
       wac.creditors,
       wac.fixed_assets,
       wac.net_assets,
       wac.total_assets_less_current_liabilities,
       wac.equity,
       wac.revenue,
       wac.profit,
       wac.officers
FROM accountants a
         LEFT JOIN companies c ON c.number::text = a.company_number
         LEFT JOIN detailed_postcodes dp ON c.postcode::text = dp.postcode
         LEFT JOIN wide_accounts_combined wac ON a.company_number = wac.company_number::text;

alter table public.accountant_view owner to "orange-pc";

grant select on public.accountant_view to frontend;

