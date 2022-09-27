create view public.officer_ages(person_number, age) as
	SELECT person_officers.person_number,
       date_part('year'::text, now()) - date_part('year'::text, person_officers.birth_date) AS age
FROM person_officers;

alter table public.officer_ages owner to "orange-pc";

