create table public.postcode_summary
(
	postcode_prefix text not null
		constraint postcode_summary_pk
			primary key,
	area text not null,
	population integer,
	households integer,
	postcodes integer,
	active_postcodes integer,
	non_geographic_postcodes integer,
	lat numeric,
	long numeric
);

comment on column public.postcode_summary.postcodes is 'total number of possible postcodes in this region';

comment on column public.postcode_summary.active_postcodes is 'the number of postcodes currently in use';

comment on column public.postcode_summary.lat is 'latitude position';

comment on column public.postcode_summary.long is 'longitudenal position
';

alter table public.postcode_summary owner to cloudsqlsuperuser;

create unique index postcode_summary_area_uindex
	on public.postcode_summary (area);

grant select on public.postcode_summary to frontend;

grant select on public.postcode_summary to black;

