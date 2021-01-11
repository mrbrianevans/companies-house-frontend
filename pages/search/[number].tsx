import { useRouter } from "next/router";

const SearchResults = () => {
  const router = useRouter();
  const number = router.query;
  return (
    <div className={"container"}>
      <h1>Search results for {number}</h1>

    </div>
  );
};

export default SearchResults;
