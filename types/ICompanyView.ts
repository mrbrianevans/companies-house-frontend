// generated typescript definitions from database using groovy script
import { FilterCategory } from './FilterCategory'

export interface ICompanyViewDatabaseItem {
	company_number?: string;
	name?: string;
	streetaddress?: string;
	county?: string;
	area?: string;
	country?: string;
	postcode?: string;
	company_type?: string;
	country_of_origin?: string;
	status?: string;
	date_of_creation?: number;
	balance_sheet_date?: Date;
	accountants?: string;
	employees?: unknown;
	current_assets?: unknown;
	cash_at_bank?: unknown;
	debtors?: unknown;
	creditors?: unknown;
	fixed_assets?: unknown;
	net_assets?: unknown;
	total_assets_less_current_liabilities?: unknown;
	equity?: unknown;
	revenue?: unknown;
	profit?: unknown;
	officers?: string[];
}

export interface ICompanyViewItem {
	companyNumber?: string;
	name?: string;
	streetaddress?: string;
	county?: string;
	area?: string;
	country?: string;
	postcode?: string;
	companyType?: string;
	countryOfOrigin?: string;
	status?: string;
	dateOfCreation?: number;
	balanceSheetDate?: Date;
	accountants?: string;
	employees?: unknown;
	currentAssets?: unknown;
	cashAtBank?: unknown;
	debtors?: unknown;
	creditors?: unknown;
	fixedAssets?: unknown;
	netAssets?: unknown;
	totalAssetsLessCurrentLiabilities?: unknown;
	equity?: unknown;
	revenue?: unknown;
	profit?: unknown;
	officers?: string[];
}

export function convertCompanyViewDatabaseItemToItem(databaseItem: ICompanyViewDatabaseItem): ICompanyViewItem {
	const item = {
		companyNumber: databaseItem.company_number,
		name: databaseItem.name,
		streetaddress: databaseItem.streetaddress,
		county: databaseItem.county,
		area: databaseItem.area,
		country: databaseItem.country,
		postcode: databaseItem.postcode,
		companyType: databaseItem.company_type,
		countryOfOrigin: databaseItem.country_of_origin,
		status: databaseItem.status,
		dateOfCreation: databaseItem.date_of_creation,
		balanceSheetDate: databaseItem.balance_sheet_date,
		accountants: databaseItem.accountants,
		employees: databaseItem.employees,
		currentAssets: databaseItem.current_assets,
		cashAtBank: databaseItem.cash_at_bank,
		debtors: databaseItem.debtors,
		creditors: databaseItem.creditors,
		fixedAssets: databaseItem.fixed_assets,
		netAssets: databaseItem.net_assets,
		totalAssetsLessCurrentLiabilities: databaseItem.total_assets_less_current_liabilities,
		equity: databaseItem.equity,
		revenue: databaseItem.revenue,
		profit: databaseItem.profit,
		officers: databaseItem.officers,
	}
	return item;
}
