import { GetServerSideProps } from "next";
import { ICompany } from "../../types/ICompany";
import { Page } from "../../components/Page";
import Link from "next/link";

const styles = require("../../styles/Home.module.css");
const formStyles = require("../../styles/form.module.css");

const SearchResults = ({
                         query,
                         companies
                       }: {
  query: string
  companies: ICompany[]
}) => {
  console.log("Results: for ", query);
  return (
    <Page>
      <h1>Search results for {query}</h1>
      <div className={styles.grid}>
        {companies.map((company) => (
          <div
            className={styles.card + " " + styles.triple}
            style={{ width: "100%" }}>
            <h4>{company.name}</h4>
            <p>{company.number}</p>
            <ul>
              {company.sicCodes?.map((s) => (
                <li>{s}</li>
              ))}
            </ul>
            <a>
              <Link href={"/company/" + company.number}>
                <button className={formStyles.go}>View</button>
              </Link>
            </a>
          </div>
        ))}
      </div>
      <hr />
      <div>
        <h2>Table format</h2>
        <table>
          <thead>
          <tr>
            <th>Company number</th>
            <th>Name</th>
            <th>Industries</th>
          </tr>
          </thead>
          <tbody>
          {companies.map((company) => (
            <tr key={company.number}>
              <td>{company.number}</td>
              <td>{company.name}</td>
              <td>
                {company.sicCodes?.map((s) => (
                  <li>{s}</li>
                ))}
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </Page>
  )
}

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
  return {
    props: {
      query: queryString,
      companies: companies
    }
  }
}
