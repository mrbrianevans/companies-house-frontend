-- GET customers by accountant name
select name, county
from companies
where number in (
    select company_number
    from accounts
    where label = 'Name of entity accountants'
      AND value = 'Somerset Accountancy Services Ltd');

SELECT *
FROM companies
WHERE name IN (
    SELECT DISTINCT value
    FROM accounts
    WHERE label = 'Name of entity accountants'
      AND company_number
        IN (
              SELECT DISTINCT company_number
              FROM accounts
              WHERE label = 'Name of production software'
                AND value = 'CCH Software'
              LIMIT 100000
          )
    LIMIT 10
);
