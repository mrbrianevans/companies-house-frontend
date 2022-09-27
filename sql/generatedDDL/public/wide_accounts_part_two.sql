create materialized view public.wide_accounts_part_two as
	SELECT r.company_number,
       (SELECT b.value::date AS value
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND b.label = 'Balance sheet date'::text
        LIMIT 1)                                                               AS balance_sheet_date,
       (SELECT b.value
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND (b.label = 'Name of entity accountants'::text OR
               b.label = 'Name of entity auditors'::text)
        LIMIT 1)                                                               AS accountants,
       (SELECT b.value
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND b.label = 'Name of production software'::text
        LIMIT 1)                                                               AS accouting_software,
       (SELECT max(to_number(b.value, '999,999,999,999'::text)) AS max
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND b.label = 'Average number of employees during the period'::text) AS employees,
       (SELECT CASE
                   WHEN avg(to_number(b.value, '999,999,999,999'::text)) > 0::numeric
                       THEN max(to_number(b.value, '999,999,999,999'::text))
                   ELSE min(to_number(b.value, '999,999,999,999'::text))
                   END AS min
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND b.label = 'Current assets'::text)                                AS current_assets,
       (SELECT CASE
                   WHEN avg(to_number(b.value, '999,999,999,999'::text)) > 0::numeric
                       THEN max(to_number(b.value, '999,999,999,999'::text))
                   ELSE min(to_number(b.value, '999,999,999,999'::text))
                   END AS min
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND b.label = 'Cash at bank and on hand'::text)                      AS cash_at_bank,
       (SELECT CASE
                   WHEN avg(to_number(b.value, '999,999,999,999'::text)) > 0::numeric
                       THEN max(to_number(b.value, '999,999,999,999'::text))
                   ELSE min(to_number(b.value, '999,999,999,999'::text))
                   END AS min
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND b.label = 'Debtors'::text)                                       AS debtors,
       (SELECT CASE
                   WHEN avg(to_number(b.value, '999,999,999,999'::text)) > 0::numeric
                       THEN max(to_number(b.value, '999,999,999,999'::text))
                   ELSE min(to_number(b.value, '999,999,999,999'::text))
                   END AS min
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND b.label = 'Creditors'::text)                                     AS creditors,
       (SELECT CASE
                   WHEN avg(to_number(b.value, '999,999,999,999'::text)) > 0::numeric
                       THEN max(to_number(b.value, '999,999,999,999'::text))
                   ELSE min(to_number(b.value, '999,999,999,999'::text))
                   END AS min
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND b.label = 'Fixed assets'::text)                                  AS fixed_assets,
       (SELECT CASE
                   WHEN avg(to_number(b.value, '999,999,999,999'::text)) > 0::numeric
                       THEN max(to_number(b.value, '999,999,999,999'::text))
                   ELSE min(to_number(b.value, '999,999,999,999'::text))
                   END AS min
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND b.label = 'Net assets (liabilities)'::text)                      AS net_assets,
       (SELECT CASE
                   WHEN avg(to_number(b.value, '999,999,999,999'::text)) > 0::numeric
                       THEN max(to_number(b.value, '999,999,999,999'::text))
                   ELSE min(to_number(b.value, '999,999,999,999'::text))
                   END AS min
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND b.label = 'Total assets less current liabilities'::text)         AS total_assets_less_current_liabilities,
       (SELECT CASE
                   WHEN avg(to_number(b.value, '999,999,999,999'::text)) > 0::numeric
                       THEN max(to_number(b.value, '999,999,999,999'::text))
                   ELSE min(to_number(b.value, '999,999,999,999'::text))
                   END AS min
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND b.label = 'Equity'::text)                                        AS equity,
       (SELECT CASE
                   WHEN avg(to_number(b.value, '999,999,999,999'::text)) > 0::numeric
                       THEN max(to_number(b.value, '999,999,999,999'::text))
                   ELSE min(to_number(b.value, '999,999,999,999'::text))
                   END AS min
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND b.label = 'Turnover / revenue'::text)                            AS revenue,
       (SELECT CASE
                   WHEN avg(to_number(b.value, '999,999,999,999'::text)) > 0::numeric
                       THEN max(to_number(b.value, '999,999,999,999'::text))
                   ELSE min(to_number(b.value, '999,999,999,999'::text))
                   END AS min
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND b.label = 'Profit (loss)'::text)                                 AS profit,
       (SELECT array_agg(DISTINCT b.value) AS array_agg
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND b.label = 'Name of entity officer'::text)                        AS officers
FROM short_list_accounts r
OFFSET 1362251 LIMIT 1362251;

alter materialized view public.wide_accounts_part_two owner to black;

