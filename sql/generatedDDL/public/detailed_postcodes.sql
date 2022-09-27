create table public.detailed_postcodes
(
	postcode text not null
		constraint detailed_postcodes_pk
			primary key,
	in_use text,
	lat double precision,
	long double precision,
	grid_ref char(8),
	county text,
	district text,
	ward text,
	district_code text,
	ward_code text,
	country text,
	county_code text,
	constituency text,
	introduced date,
	terminated date,
	parish text,
	national_park text,
	population integer,
	households integer,
	built_up_area text,
	built_up_sub_division text,
	lower_layer_super_output_area text,
	rural_urban text,
	region text,
	"Altitude" integer,
	local_authority text,
	msoa_code text,
	msoa text,
	parish_code text,
	census_output_area text,
	constituency_code text,
	lat_updated date,
	nearest_station text,
	postcode_prefix text,
	postcode_district text,
	plus_code text,
	average_income numeric
);

alter table public.detailed_postcodes owner to cloudsqlsuperuser;

create index detailed_postcodes_county_idx
	on public.detailed_postcodes (county);

create index detailed_postcodes_county_idx1
	on public.detailed_postcodes using hash (county);

grant select on public.detailed_postcodes to frontend;

grant select on public.detailed_postcodes to stream;

grant select on public.detailed_postcodes to black;

