import { IStringFilter, IStringFilterOption } from '../../../types/IFilters'
import { IMinorQuery } from '../../../types/IQueries'
import { getSqlLikeValues } from '../../../helpers/getSqlLikeValues'

export const filterCompaniesByLocation: (filter: IStringFilter) => IMinorQuery = (filter) => {
  // todo: this has a bug: some post code prefixes are only a single letter long, which includes unwanted results
  const query = `
      SELECT c.number AS company_number
      FROM companies c,
           postcode_summary p
      WHERE c.postcode LIKE p.postcode_prefix || '%'
        AND lower(p.area) LIKE ANY (?)
  `
  const value = getSqlLikeValues(filter)
  return { query, value }
}

export const filterCompaniesByLocationMetadata: IStringFilterOption = {
  category: 'location',
  possibleComparisons: ['begins with', 'is exactly', 'includes', 'ends with'],
  valueType: 'string',
  suggestions: [
    'Bristol',
    'Harrow',
    'Kirkwall',
    'South East London',
    'Bournemouth',
    'Swindon',
    'Milton Keynes',
    'Twickenham',
    'Leeds',
    'Birmingham',
    'Oldham',
    'Stockport',
    'Blackpool',
    'Truro',
    'Portsmouth',
    'Dudley',
    'Stevenage',
    'Slough',
    'Wolverhampton',
    'Newport',
    'Hemel Hempstead',
    'Darlington',
    'Crewe',
    'Bradford',
    'Northern Ireland',
    'Taunton',
    'Newcastle upon Tyne',
    'Leicester',
    'Swansea',
    'Cardiff',
    'Rochester',
    'Lincoln',
    'Durham',
    'Bath',
    'Exeter',
    'Doncaster',
    'Galashiels',
    'Torquay',
    'North West London',
    'Kirkcaldy',
    'Brighton',
    'Edinburgh',
    'Coventry',
    'Southend-on-Sea',
    'Carlisle',
    'St Albans',
    'Tonbridge',
    'Sheffield',
    'Paisley',
    'Gloucester',
    'Falkirk and Stirling',
    'Telford',
    'Oxford',
    'West London',
    'Ipswich',
    'Northampton',
    'Cambridge',
    'Perth',
    'York',
    'Hull',
    'South West London',
    'Aberdeen',
    'Kilmarnock',
    'Shrewsbury',
    'Llandudno',
    'Derby',
    'Bromley',
    'Guildford',
    'Outer Hebrides',
    'Dumfries and Galloway',
    'Lerwick',
    'Romford',
    'Wakefield',
    'Plymouth',
    'Inverness',
    'Sunderland',
    'East London',
    'Lancaster',
    'Warrington',
    'Manchester',
    'Central London',
    'Worcester',
    'Peterborough',
    'Dartford',
    'Chester',
    'Stoke-on-Trent',
    'Motherwell',
    'Hereford',
    'Southall',
    'Dundee',
    'Wigan',
    'Enfield',
    'Dorchester',
    'Luton',
    'Watford',
    'Southampton',
    'Bolton',
    'North London',
    'Harrogate',
    'Sutton',
    'Canterbury',
    'Croydon',
    'Colchester',
    'Chelmsford',
    'Kingston upon Thames',
    'Nottingham',
    'Huddersfield',
    'Reading',
    'Glasgow',
    'Blackburn',
    'Halifax',
    'Redhill',
    'Ilford',
    'Llandrindod Wells',
    'Norwich',
    'Preston',
    'Liverpool',
    'Cleveland',
    'Salisbury',
    'Walsall'
  ]
}
