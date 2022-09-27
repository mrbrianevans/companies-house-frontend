create table public.officer_appointments
(
	company_number char(8),
	person_number char(12)
		constraint officer_appointments_person_number_fkey
			references public.person_officers,
	appointment_type text,
	appointment_date date
);

alter table public.officer_appointments owner to "orange-pc";

create index officer_appointments_person_number_idx
	on public.officer_appointments (person_number);

create index officer_appointments_company_number_idx
	on public.officer_appointments (company_number);

grant select on public.officer_appointments to frontend;

