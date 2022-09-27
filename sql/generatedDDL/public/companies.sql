create table public.companies
(
	name varchar(160),
	number char(8) not null
		constraint companies_pkey
			primary key,
	streetaddress varchar(300),
	county varchar(50),
	country varchar(50),
	postcode varchar(20),
	category varchar(100),
	origin varchar(50),
	status varchar(70),
	date timestamp,
	updated date default CURRENT_DATE,
	can_file boolean,
	not_found boolean
);

alter table public.companies owner to cloudsqlsuperuser;

create index indexed_name
	on public.companies (name);

create index companies_upper_idx
	on public.companies (upper(name::text));

create index companies_upper_idx1
	on public.companies (upper(name::text));

create index trgm_idx_companies_name
	on public.companies using gin (name gin_trgm_ops);

create index trgm_idx_companies_upper_name
	on public.companies using gin (upper(name::text) gin_trgm_ops);

create index companies_number_idx
	on public.companies ((number::text));

create index companies_postcode_idx
	on public.companies (postcode);

create index companies_date_idx
	on public.companies (date);

grant select on public.companies to local;

grant select on public.companies to frontend;

grant select on public.companies to stream;

grant select on public.companies to black;

