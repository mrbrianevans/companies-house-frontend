import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";

const SearchResults = () => {
  const router = useRouter();
  const { query }: ParsedUrlQuery = router.query;
  return (
    <div className={"container"}>
      <h1>Search results for {query}</h1>
      <table>
        <thead>
        <tr>
          <th>Company number</th>
          <th>Name</th>
          <th>Industry</th>
        </tr>
        </thead>
        <tbody>

        </tbody>
      </table>
    </div>
  );
};

export default SearchResults;
