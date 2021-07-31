// generated typescript definitions from database using groovy script
import { FilterCategory } from './FilterCategory'

export interface IPersonOfficersDatabaseItem {
	person_number?: unknown;
	post_code?: string;
	birth_date?: Date;
	title?: unknown;
	forenames?: unknown;
	surname?: string;
	honours?: unknown;
	care_of?: unknown;
	po_box?: unknown;
	address_line_1?: string;
	address_line_2?: unknown;
	post_town?: unknown;
	county?: unknown;
	country?: unknown;
	occupation?: unknown;
	nationality?: unknown;
	usual_residential_country?: unknown;
	officer_name_vector?: unknown;
}

export interface IPersonOfficersItem {
	personNumber?: unknown;
	postCode?: string;
	birthDate?: Date;
	title?: unknown;
	forenames?: unknown;
	surname?: string;
	honours?: unknown;
	careOf?: unknown;
	poBox?: unknown;
	addressLine1?: string;
	addressLine2?: unknown;
	postTown?: unknown;
	county?: unknown;
	country?: unknown;
	occupation?: unknown;
	nationality?: unknown;
	usualResidentialCountry?: unknown;
	officerNameVector?: unknown;
}

export function convertPersonOfficersDatabaseItemToItem(databaseItem: IPersonOfficersDatabaseItem): IPersonOfficersItem {
	const item = {
		personNumber: databaseItem.person_number,
		postCode: databaseItem.post_code,
		birthDate: databaseItem.birth_date,
		title: databaseItem.title,
		forenames: databaseItem.forenames,
		surname: databaseItem.surname,
		honours: databaseItem.honours,
		careOf: databaseItem.care_of,
		poBox: databaseItem.po_box,
		addressLine1: databaseItem.address_line_1,
		addressLine2: databaseItem.address_line_2,
		postTown: databaseItem.post_town,
		county: databaseItem.county,
		country: databaseItem.country,
		occupation: databaseItem.occupation,
		nationality: databaseItem.nationality,
		usualResidentialCountry: databaseItem.usual_residential_country,
		officerNameVector: databaseItem.officer_name_vector,
	}
	return item;
}
