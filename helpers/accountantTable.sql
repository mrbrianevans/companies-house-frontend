-- this finds all the accountants mentioned in accounts, and inserts them into accountants table
-- including their number of clients and an array of the software they use
WITH moved_rows AS (
    select value                          as accountant_name,
           count(distinct company_number) as number_of_clients,
           (SELECT array_agg(distinct value) as software
            from accounts
            where label = 'Name of production software'
              and company_number = ANY (
                select company_number
                from accounts b
                where label = 'Name of entity accountants' AND b.value = a.value
            ))                            as software
    from accounts a
    where label = 'Name of entity accountants'
    group by value
    order by number_of_clients desc
)
INSERT
INTO accountants (name, number_of_clients, software) --specify columns if necessary
    (SELECT DISTINCT accountant_name, number_of_clients, software FROM moved_rows)
ON CONFLICT (name) DO UPDATE SET software=excluded.software;


SELECT array_agg(distinct value) as software
from accounts
where label = 'Name of production software'
  and company_number = ANY (
    select company_number
    from accounts
    where label = 'Name of entity accountants'
      AND value = 'Haines Watts'
);

select value,
       count(distinct company_number) as number_of_clients,
       (SELECT array_agg(distinct value) as software
        from accounts
        where label = 'Name of production software'
          and company_number = ANY (
            select company_number
            from accounts b
            where label = 'Name of entity accountants' AND value = a.value
        ))                            as software
from accounts a
where label = 'Name of entity accountants'
group by value
order by number_of_clients desc
limit 5;

