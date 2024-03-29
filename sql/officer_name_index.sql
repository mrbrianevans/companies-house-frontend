ALTER TABLE person_officers DROP COLUMN IF EXISTS officer_name_vector;

-- create name index on person_officers for faster searching
ALTER TABLE person_officers
    ADD COLUMN officer_name_vector tsvector
        GENERATED ALWAYS AS (to_tsvector('simple',coalesce(forenames, '') || ' ' || surname)) STORED;

CREATE INDEX officer_name_index ON person_officers USING GIN (officer_name_vector);

-- execution: 27 ms (after warming the cache)
SELECT *, ts_rank_cd(officer_name_vector, to_tsquery('brian & evans')) AS rank
FROM person_officers
WHERE officer_name_vector @@ to_tsquery('simple','brian & evans')
ORDER BY rank DESC
LIMIT 10;


-- execution: 28 ms
SELECT *
FROM person_officers JOIN detailed_postcodes dp on person_officers.post_code = dp.postcode
WHERE officer_name_vector @@ to_tsquery('simple','bruce & evans & david');

-- postgres.public> CREATE INDEX ON person_officers USING hash(nationality)
-- [2021-08-08 07:56:15] completed in 15 h 59 m 56 s 559 ms

-- postgres.public> CREATE INDEX ON person_officers (occupation)
-- [2021-08-09 18:17:49] completed in 1 m 10 s 138 ms