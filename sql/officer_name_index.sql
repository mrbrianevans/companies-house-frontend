-- create name index on person_officers for faster searching
ALTER TABLE person_officers
    ADD COLUMN officer_name_vector tsvector
        GENERATED ALWAYS AS (to_tsvector('english',coalesce(forenames, '') || ' ' || coalesce(surname, ''))) STORED;

CREATE INDEX officer_name_index ON person_officers USING GIN (officer_name_vector);

SELECT *, ts_rank_cd(officer_name_vector, to_tsquery('brian & evans')) AS rank
FROM person_officers
WHERE officer_name_vector @@ to_tsquery('brian & evans')
ORDER BY rank DESC
LIMIT 10;

SELECT *
FROM person_officers JOIN detailed_postcodes dp on person_officers.post_code = dp.postcode
WHERE officer_name_vector @@ to_tsquery('bruce & evans & david');

