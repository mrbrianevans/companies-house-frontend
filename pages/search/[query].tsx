import { GetServerSideProps } from "next";

const SearchResults = ({ results }: { results: { query: string, companies: [] } }) => {
  return (
    <div className={"container"}>
      <h1>Search results for {results.query}</h1>
      <table>
        <thead>
        <tr>
          <th>Company number</th>
          <th>Name</th>
          <th>Industry</th>
        </tr>
        </thead>
        <tbody>
        {/*results.companies.map(company=>(<tr></tr>)*/}
        </tbody>
      </table>
    </div>
  );
};

export default SearchResults;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const query = context.params.query.toString();

  return (
    {
      props: {
        query,
        companies: []
      }
    }
  );
};
