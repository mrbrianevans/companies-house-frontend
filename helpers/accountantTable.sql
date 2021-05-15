-- this finds all the accountants mentioned in accounts, and inserts them into accountants table
-- including their number of clients and an array of the software they use
WITH moved_rows AS (
    select value                          as accountant_name,
           count(distinct company_number) as number_of_clients,
           (SELECT array_agg(distinct c.value) as software
            from company_accounts c
            where c.label = 'Name of production software'
              and c.company_number = ANY (
                select b.company_number
                from company_accounts b
                where label = 'Name of entity accountants'
                  AND b.value = a.value
            ))                            as software
    from company_accounts a
    where label = 'Name of entity accountants'
    group by value
    order by number_of_clients desc
)
INSERT
INTO legacy_accountants (name, number_of_clients, software) --specify columns if necessary
    (SELECT DISTINCT accountant_name, number_of_clients, software FROM moved_rows)
ON CONFLICT (name) DO UPDATE SET software=excluded.software;


-- Match names with company numbers for accountants
SELECT a.name as aname, c.name as cname, c.number as cnumber, c.county
FROM legacy_accountants a
         INNER JOIN companies c
                    ON c.name ILIKE a.name
LIMIT 10;
--update version:
WITH matches AS
         (
             SELECT a.name as aname, c.name as cname, c.number as cnumber, c.county
             FROM legacy_accountants a
                      INNER JOIN companies c
                                 ON lower(a.name) = lower(c.name)
         )
UPDATE legacy_accountants
SET company_number=matches.cnumber
FROM matches
WHERE name = matches.aname
RETURNING matches.aname, matches.cname, matches.cnumber
;

WITH matches AS (
    SELECT * FROM legacy_accountants WHERE software && (ARRAY ['CCH Software'])
)
SELECT DISTINCT (a.name),
                a.company_number,
                a.software,
                a.number_of_clients,
                p.area,
                c.date,
                c.status,
                c.streetaddress
FROM matches a,
     companies c,
     postcode_summary p
WHERE a.company_number = c.number
  AND c.postcode LIKE p.postcode_prefix || '%'
LIMIT 10;
