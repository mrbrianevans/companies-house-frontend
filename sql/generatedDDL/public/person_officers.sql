create table public.person_officers
(
	person_number char(12) not null
		constraint person_officers_pkey
			primary key,
	post_code text,
	birth_date date,
	title varchar(50),
	forenames varchar(50),
	surname text not null,
	honours varchar(50),
	care_of varchar(100),
	po_box varchar(10),
	address_line_1 text,
	address_line_2 varchar(50),
	post_town varchar(50),
	county varchar(50),
	country varchar(50),
	occupation varchar(40),
	nationality varchar(40),
	usual_residential_country varchar(160),
	officer_name_vector tsvector generated always as (to_tsvector('simple'::regconfig, (((COALESCE(forenames, ''::character varying))::text || ' '::text) || surname))) stored
);

alter table public.person_officers owner to "orange-pc";

create index person_officers_birth_date_idx
	on public.person_officers (birth_date);

create index person_officers_nationality_idx
	on public.person_officers using hash (nationality);

create index person_officers_occupation_idx
	on public.person_officers (occupation);

create index officer_name_index
	on public.person_officers using gin (officer_name_vector);

grant select on public.person_officers to frontend;

