import { IFilterConfig } from '../types/IFilterConfig'
import { filterCompaniesByAge, filterCompaniesByAgeMetadata } from '../interface/filterCompanies/filters/age'
import { ICompanyProfile } from '../types/ICompany'
import { filterCompaniesByName, filterCompaniesByNameMetadata } from '../interface/filterCompanies/filters/name'
import {
  filterCompaniesBySicCode,
  filterCompaniesBySicCodeMetadata
} from '../interface/filterCompanies/filters/sicCode'
import {
  filterCompaniesBySicCodeDescription,
  filterCompaniesBySicCodeDescriptionMetadata
} from '../interface/filterCompanies/filters/sicCodeDescription'
import {
  filterCompaniesByLocation,
  filterCompaniesByLocationMetadata
} from '../interface/filterCompanies/filters/location'
import { filterCompaniesByStatus, filterCompaniesByStatusMetadata } from '../interface/filterCompanies/filters/status'
import {
  filterCompaniesByChangeOfOwnership,
  filterCompaniesByChangeOfOwnershipMetadata
} from '../interface/filterCompanies/filters/changeOfOwnership'
import {
  filterCompaniesByCurrentAssets,
  filterCompaniesByCurrentAssetsMetadata
} from '../interface/filterCompanies/filters/currentAssets'
import {
  filterCompaniesByEmployees,
  filterCompaniesByEmployeesMetadata
} from '../interface/filterCompanies/filters/employees'
import {
  filterCompaniesByDebtors,
  filterCompaniesByDebtorsMetadata
} from '../interface/filterCompanies/filters/debtors'
import {
  filterCompaniesByNetAssets,
  filterCompaniesByNetAssetsMetadata
} from '../interface/filterCompanies/filters/netAssets'
import { filterCompaniesByProfit, filterCompaniesByProfitMetadata } from '../interface/filterCompanies/filters/profit'
import {
  filterCompaniesByCreditors,
  filterCompaniesByCreditorsMetadata
} from '../interface/filterCompanies/filters/creditors'
import {
  filterCompaniesByCashAtBank,
  filterCompaniesByCashAtBankMetadata
} from '../interface/filterCompanies/filters/cashAtBank'

export const companyFilterConfig: IFilterConfig = {
  countResultsApiUrl: '/api/companies/countFilterResults',
  getFilterIdApiUrl: '/api/companies/filterRedirect',
  redirectUrl: '/company/filter/',
  viewItemUrl: '/company/',
  labelPlural: 'companies',
  labelSingular: 'company',
  main_table: 'company_view',
  operation_code: 'download_company_records',
  uniqueIdentifier: 'company_number',
  filters: [
    { filterOption: filterCompaniesByAgeMetadata, sqlGenerator: filterCompaniesByAge },
    {
      filterOption: filterCompaniesByNameMetadata,
      sqlGenerator: filterCompaniesByName
    },
    {
      filterOption: filterCompaniesBySicCodeMetadata,
      sqlGenerator: filterCompaniesBySicCode
    },
    {
      filterOption: filterCompaniesBySicCodeDescriptionMetadata,
      sqlGenerator: filterCompaniesBySicCodeDescription
    },
    {
      filterOption: filterCompaniesByLocationMetadata,
      sqlGenerator: filterCompaniesByLocation
    },
    {
      filterOption: filterCompaniesByStatusMetadata,
      sqlGenerator: filterCompaniesByStatus
    },
    {
      filterOption: filterCompaniesByChangeOfOwnershipMetadata,
      sqlGenerator: filterCompaniesByChangeOfOwnership
    },
    {
      filterOption: filterCompaniesByProfitMetadata,
      sqlGenerator: filterCompaniesByProfit
    },
    {
      filterOption: filterCompaniesByEmployeesMetadata,
      sqlGenerator: filterCompaniesByEmployees
    },
    {
      filterOption: filterCompaniesByCurrentAssetsMetadata,
      sqlGenerator: filterCompaniesByCurrentAssets
    },
    {
      filterOption: filterCompaniesByCashAtBankMetadata,
      sqlGenerator: filterCompaniesByCashAtBank
    },
    {
      filterOption: filterCompaniesByDebtorsMetadata,
      sqlGenerator: filterCompaniesByDebtors
    },
    {
      filterOption: filterCompaniesByCreditorsMetadata,
      sqlGenerator: filterCompaniesByCreditors
    },
    {
      filterOption: filterCompaniesByNetAssetsMetadata,
      sqlGenerator: filterCompaniesByNetAssets
    }
  ]
}
