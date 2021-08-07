// generated typescript definitions from database using groovy script
import { IAddress } from './IAddress'

export interface IDetailedPostcodesDatabaseItem {
  postcode?: string
  in_use?: string
  lat?: number
  long?: number
  grid_ref?: string
  county?: string
  district?: string
  ward?: string
  district_code?: string
  ward_code?: string
  country?: string
  county_code?: string
  constituency?: string
  introduced?: Date
  terminated?: Date
  parish?: string
  national_park?: string
  population?: number
  households?: number
  built_up_area?: string
  built_up_sub_division?: string
  lower_layer_super_output_area?: string
  rural_urban?: string
  region?: string
  Altitude?: number
  local_authority?: string
  msoa_code?: string
  msoa?: string
  parish_code?: string
  census_output_area?: string
  constituency_code?: string
  lat_updated?: Date
  nearest_station?: string
  postcode_prefix?: string
  postcode_district?: string
  plus_code?: string
  average_income?: unknown
}

export interface IDetailedPostcodesItem {
  postcode?: string
  inUse?: string
  lat?: number
  long?: number
  gridRef?: string
  county?: string
  district?: string
  ward?: string
  districtCode?: string
  wardCode?: string
  country?: string
  countyCode?: string
  constituency?: string
  introduced?: Date
  terminated?: Date
  parish?: string
  nationalPark?: string
  population?: number
  households?: number
  builtUpArea?: string
  builtUpSubDivision?: string
  lowerLayerSuperOutputArea?: string
  ruralUrban?: string
  region?: string
  altitude?: number
  localAuthority?: string
  msoaCode?: string
  msoa?: string
  parishCode?: string
  censusOutputArea?: string
  constituencyCode?: string
  latUpdated?: Date
  nearestStation?: string
  postcodePrefix?: string
  postcodeDistrict?: string
  plusCode?: string
  averageIncome?: unknown
}

export function convertDetailedPostcodesDatabaseItemToItem(
  databaseItem: IDetailedPostcodesDatabaseItem
): IDetailedPostcodesItem {
  const item = {
    postcode: databaseItem.postcode,
    inUse: databaseItem.in_use,
    lat: databaseItem.lat,
    long: databaseItem.long,
    gridRef: databaseItem.grid_ref,
    county: databaseItem.county,
    district: databaseItem.district,
    ward: databaseItem.ward,
    districtCode: databaseItem.district_code,
    wardCode: databaseItem.ward_code,
    country: databaseItem.country,
    countyCode: databaseItem.county_code,
    constituency: databaseItem.constituency,
    introduced: databaseItem.introduced,
    terminated: databaseItem.terminated,
    parish: databaseItem.parish,
    nationalPark: databaseItem.national_park,
    population: databaseItem.population,
    households: databaseItem.households,
    builtUpArea: databaseItem.built_up_area,
    builtUpSubDivision: databaseItem.built_up_sub_division,
    lowerLayerSuperOutputArea: databaseItem.lower_layer_super_output_area,
    ruralUrban: databaseItem.rural_urban,
    region: databaseItem.region,
    altitude: databaseItem.Altitude,
    localAuthority: databaseItem.local_authority,
    msoaCode: databaseItem.msoa_code,
    msoa: databaseItem.msoa,
    parishCode: databaseItem.parish_code,
    censusOutputArea: databaseItem.census_output_area,
    constituencyCode: databaseItem.constituency_code,
    latUpdated: databaseItem.lat_updated,
    nearestStation: databaseItem.nearest_station,
    postcodePrefix: databaseItem.postcode_prefix,
    postcodeDistrict: databaseItem.postcode_district,
    plusCode: databaseItem.plus_code,
    averageIncome: databaseItem.average_income
  }
  return item
}

export const convertDetailPostcodesToAddress: (
  detailedPostcode: IDetailedPostcodesItem,
  streetAddress: string
) => IAddress = (detailedPostcode, streetAddress) => {
  if (!detailedPostcode) return null
  return {
    city: detailedPostcode.builtUpArea ?? null,
    country: detailedPostcode.country ?? null,
    county: detailedPostcode.county ?? null,
    lat: detailedPostcode.lat ?? null,
    long: detailedPostcode.long ?? null,
    postCode: detailedPostcode.postcode ?? null,
    streetAddress: streetAddress ?? null
  }
}
