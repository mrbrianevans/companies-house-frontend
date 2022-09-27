create table public.psc
(
	company_number char(8) not null
		constraint psc_company_number_fkey
			references public.companies,
	address_line_1 varchar(100),
	address_line_2 varchar(100),
	address_country varchar(50),
	address_locality varchar(70),
	address_po_box varchar(15),
	address_post_code varchar(15),
	address_premises varchar(15),
	address_region varchar(50),
	ceased_on timestamp,
	country_of_residence varchar(50),
	dob_day smallint,
	dob_month smallint,
	dob_year smallint,
	etag char(40),
	person_id char(27) not null,
	name_title varchar(6),
	first_name varchar(50),
	surname varchar(100),
	nationality varchar(50),
	notified_on timestamp,
	updated timestamp,
	nature_of_control text[],
	constraint psc_pkey
		primary key (company_number, person_id)
);

alter table public.psc owner to cloudsqlsuperuser;

grant select on public.psc to black;

