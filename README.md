 # Companies House #

This is a nextjs website, which serves API endpoints under `/api` and a Graphical UI under `/`.

 ### Technology
- Typescript
- NodeJS
- NextJS
- PostgreSQL database

 ### API Endpoints
| Endpoint | Parameters | Description |
| --- | --- | --- |
| `/api/` |  | API docs |
| `/api/company` | company_number | Get details about a specific company |
| `/api/search` | query&by | Search for companies based on a text query (by name etc) |
| `/api/filter` | filters | Filter a list of companies where `filters` is an array of conditions |

### GUI Pages
| URL | Description |
| --- | --- |
| `/`| Website docs |
| `/company` | Get details about a specific company |
| `/search` | Search for companies based on a text query (by name etc) |
| `/filter` | Filter a list of companies where `filters` is an array of conditions |

 ### Database relations
 #### companies
 | Column | Data type | Description |
 | --- | --- | --- |
 | `number` | char(8) | Company number string |
 | `name` | varchar(160) | Name of company |
 | `streetaddress` | varchar(300) | Company street address |
 | `county` | varchar(50) | Company address county |
 | `country` | varchar(50) | Company address country |
 | `postcode` | varchar(20) | Company address postcode |
 | `category` | varchar(100) | Company type like LLC |
 | `origin` | varchar(50) | Country of origin |
 | `status` | varchar(70) | If the company is active |
 | `date` | date | The date of incorporation |
