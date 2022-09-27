create view public.company_view(company_number, name, streetaddress, county, area, country, postcode, company_type, country_of_origin, status, date_of_creation, balance_sheet_date, accountants, employees, current_assets, cash_at_bank, debtors, creditors, fixed_assets, net_assets, total_assets_less_current_liabilities, equity, revenue, profit, officers) as
	SELECT DISTINCT ON (wac.company_number) wac.company_number,
                                        c.name,
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
FROM wide_accounts_combined wac
         JOIN companies c ON c.number = wac.company_number
         JOIN detailed_postcodes dp ON c.postcode::text = dp.postcode
ORDER BY wac.company_number, wac.balance_sheet_date DESC;

alter table public.company_view owner to "orange-pc";

grant select on public.company_view to frontend;

grant select on public.company_view to stream;

