create table public.accounts_scanned
(
	filename text,
	time_started timestamp default CURRENT_TIMESTAMP,
	company_number char(8) not null,
	accounts_date date not null,
	status text,
	time_finished timestamp,
	zip_file_date date,
	csv_scanned timestamp,
	number_of_facts integer,
	number_of_long_facts integer,
	errors text,
	constraint accounts_scanned_pkey
		primary key (company_number, accounts_date)
);

alter table public.accounts_scanned owner to cloudsqlsuperuser;

grant select on public.accounts_scanned to black;

