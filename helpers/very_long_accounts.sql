-- This was done to allow for indexing of accounts while preserving the data
-- some lines were too long to index
-- This should never have to be run again, but this file serves as a historical record
select length(label) + length(value) as strlen, label, value
from accounts
where length(label) + length(value) > 2000
order by strlen desc
limit 500;
create table very_long_accounts
(
    company_number char(8) not null
        constraint accounts_company_number_fkey
            references companies,
    name           text    not null,
    label          text,
    context_ref    text    not null,
    value          text,
    start_date     date,
    end_date       date    not null,
    unit           text,
    decimals       integer,
    captured       timestamp default CURRENT_TIMESTAMP,
    constraint very_long_accounts_pkey
        primary key (company_number, name, end_date, context_ref)
);

WITH moved_rows AS (
    SELECT *
    FROM accounts a
    WHERE length(label) + length(value) >= 2000
    -- RETURNING a -- or specify columns
)
INSERT
INTO very_long_accounts --specify columns if necessary
        (SELECT DISTINCT * FROM moved_rows);

DELETE
FROM accounts
where length(label) + length(value) = 2000;
ALTER TABLE accounts
    DROP CONSTRAINT IF EXISTS short_label_and_value;
-- this constraint ensures that no long lines will ever be inserted again
ALTER TABLE accounts
    ADD CONSTRAINT short_label_and_value CHECK ( length(label) + length(value) < 2000 );
-- if insertion fails, you should try insert into very_long_accounts (same schema as accounts)

-- this is the index:
