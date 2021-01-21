import { GetServerSideProps } from "next";
import { ICompany } from "../../types/ICompany";

const SearchResults = ({ query, companies }: { query: string, companies: ICompany[] }) => {
  console.log("Results: for ", query);
  return (
    <div className={"container"}>
      <h1>Search results for {query}</h1>
      <table>
        <thead>
        <tr>
          <th>Company number</th>
          <th>Name</th>
          <th>Industries</th>
        </tr>
        </thead>
        <tbody>
        {companies.map(company => (
          <tr key={company.number}>
            <td>{company.number}</td>
            <td>{company.name}</td>
            <td>{company.sicCodes.map(s => <li>{s}</li>)}</td>
          </tr>)
        )
        }
        </tbody>
      </table>
    </div>
  );
};

export default SearchResults;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const query = context.params.query.toString();

  const apiURL = "http://localhost:8080/api/search/" + encodeURIComponent(query);
  const apiResponse = await fetch(apiURL);
  let companies: ICompany[];
  let queryString = "";
  if (apiResponse.status === 200) {
    const apiJSON = await apiResponse.json();
    companies = apiJSON["companies"];
    queryString = apiJSON["query"];
    // console.log("API response: ", apiJSON)
  } else {
    companies = [];
  }
  return (
    {
      props: {
        query: queryString,
        companies: companies
      }
    }
  );
};
