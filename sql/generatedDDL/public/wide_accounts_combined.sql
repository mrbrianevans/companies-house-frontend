create materialized view public.wide_accounts_combined as
	SELECT wide_accounts.company_number,
       wide_accounts.balance_sheet_date,
       wide_accounts.accountants,
       wide_accounts.accouting_software,
       wide_accounts.employees,
       wide_accounts.current_assets,
       wide_accounts.cash_at_bank,
       wide_accounts.debtors,
       wide_accounts.creditors,
       wide_accounts.fixed_assets,
       wide_accounts.net_assets,
       wide_accounts.total_assets_less_current_liabilities,
       wide_accounts.equity,
       wide_accounts.revenue,
       wide_accounts.profit,
       wide_accounts.officers
FROM wide_accounts
UNION
SELECT wide_accounts_part_two.company_number,
       wide_accounts_part_two.balance_sheet_date,
       wide_accounts_part_two.accountants,
       wide_accounts_part_two.accouting_software,
       wide_accounts_part_two.employees,
       wide_accounts_part_two.current_assets,
       wide_accounts_part_two.cash_at_bank,
       wide_accounts_part_two.debtors,
       wide_accounts_part_two.creditors,
       wide_accounts_part_two.fixed_assets,
       wide_accounts_part_two.net_assets,
       wide_accounts_part_two.total_assets_less_current_liabilities,
       wide_accounts_part_two.equity,
       wide_accounts_part_two.revenue,
       wide_accounts_part_two.profit,
       wide_accounts_part_two.officers
FROM wide_accounts_part_two;

alter materialized view public.wide_accounts_combined owner to "orange-pc";

create index wide_accounts_combined_accountants_idx
	on public.wide_accounts_combined (accountants);

create index wide_accounts_combined_accouting_software_idx
	on public.wide_accounts_combined (accouting_software);

create index wide_accounts_combined_company_number_idx
	on public.wide_accounts_combined (company_number);

create index wide_accounts_combined_balance_sheet_date_idx
	on public.wide_accounts_combined (balance_sheet_date);

create index wide_accounts_combined_employees_idx
	on public.wide_accounts_combined (employees);

grant select on public.wide_accounts_combined to frontend;

grant select on public.wide_accounts_combined to black;

