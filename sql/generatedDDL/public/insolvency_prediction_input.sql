create view public.insolvency_prediction_input(company_number, average_income_of_area, altitude, latitude, longtitude, company_type, date_of_creation, status, updated, age_years, balance_sheet_date, employees, current_assets, cash_at_bank, debtors, creditors, fixed_assets, net_assets, total_assets_less_current_liabilities, equity, revenue, profit, number_of_officers) as
	SELECT c.number                                                 AS company_number,
       dp.average_income                                        AS average_income_of_area,
       dp."Altitude"                                            AS altitude,
       dp.lat                                                   AS latitude,
       dp.long                                                  AS longtitude,
       c.category                                               AS company_type,
       c.date                                                   AS date_of_creation,
       c.status,
       c.updated,
       2021::double precision - date_part('year'::text, c.date) AS age_years,
       wac.balance_sheet_date,
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
       array_length(wac.officers, 1)                            AS number_of_officers
FROM wide_accounts_combined wac
         JOIN companies c ON c.number = wac.company_number
         JOIN detailed_postcodes dp ON c.postcode::text = dp.postcode
WHERE wac.employees IS NOT NULL
  AND wac.employees < 100000::numeric
ORDER BY wac.employees DESC
LIMIT 100000;

alter table public.insolvency_prediction_input owner to "orange-pc";

