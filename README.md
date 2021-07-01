 # Filter Facility #

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
| `/api/filter` | filters | Index a list of companies where `filters` is an array of conditions |

### GUI Pages
| URL | Description |
| --- | --- |
| `/`| Website docs |
| `/company` | Get details about a specific company |
| `/search` | Search for companies based on a text query (by name etc) |
| `/filter` | Index a list of companies where `filters` is an array of conditions |
