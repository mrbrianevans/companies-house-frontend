import { Page } from "../../components/Page";
import * as React from "react";
import { useState } from "react";
import { NewFilterCard } from "../../components/NewFilterCard";
import { IFilter, IFilterOption } from "../../types/IFilters";
import { GetServerSideProps } from "next";

const styles = require("../../styles/Home.module.css");

interface Props {
  filterOptions: IFilterOption[]
}

const SearchPage = ({ filterOptions }: Props) => {
  //todo:
  // - send a post request when the user submits the filters
  const [showNewFilterForm, setShowNewFilterForm] = useState<boolean>(
    filterOptions.length > 0
  );
  const [filters, setFilters] = useState<IFilter[]>([]);
  const addFilter = (filter: IFilter) => {
    setShowNewFilterForm(false);
    setFilters((prevState) => [filter, ...prevState]);
    setTimeout(() => {
      setShowNewFilterForm(true);
    }, 1000);
  };
  const [filterMatchesLoading, setFilterMatchesLoading] = useState(false);
  const applyFilter = () => {
    console.log("Requesting filter from backend: ", filters);
    setFilterMatchesLoading(true);
    fetch("http://localhost:8080/api/accountants/filter", {
      method: "POST",
      body: JSON.stringify(filters),
      headers: { "Content-Type": "application/json" }
    })
      .then((r) => r.json())
      .then((j) => setMatchingAccountants(j))
      // .then(console.log)
      .then(() => console.log("Request finished"))
      .then(() => setFilterMatchesLoading(false))
      .catch(console.error);
  };
  const [matchingAccountants, setMatchingAccountants] = useState<{ value: string }[]>();
  return (
    <Page>
      <h1>Accountants</h1>
      <div className={styles.grid}>
        {showNewFilterForm ? (
          <NewFilterCard addFilter={addFilter} filterOptions={filterOptions} />
        ) : (
          <></>
        )}
        {filters?.map((filter: IFilter, i) => (
          <div className={styles.card} style={{ width: "100%" }} key={i}>
            <h3>Filter {i + 1}</h3>
            <p>
              {filter.exclude ? "Exclude" : "Only show"} accountants where{" "}
              {filter.category} {filter.comparison}{" "}
              {filter.type === "number"
                ? filter.min + " and " + filter.max
                : filter.values.join(" or ")}
            </p>
          </div>
        ))}
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <button onClick={applyFilter}>Apply filter</button>
        </div>
        {
          filterMatchesLoading && <div className={styles.card}><h2>Loading...</h2></div>
        }
        {
          matchingAccountants &&
          <div style={{ width: "100%" }}>
            <table style={{ width: "100%" }}>
              <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Number of clients</th>
              </tr>
              </thead>
              <tbody>
              {matchingAccountants?.map((accountant) => (
                <tr key={accountant.value}>
                  <td><a href={"/search/" + accountant.value}
                         target={"_blank"}>{accountant.value}</a></td>
                  <td></td>
                  <td></td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        }
      </div>


    </Page>
  )
}

export default SearchPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const returnProps: Props = {
    // filterOptions: [{category: "an error has occurred", possibleComparisons: ["is exactly"], valueType: 'string'}]
    filterOptions: []
  }
  const filterOptionsRequest = await fetch(
    "http://localhost:8080/api/accountants/getFilters"
  );
  if (filterOptionsRequest.status === 200)
    returnProps.filterOptions = await filterOptionsRequest.json();
  return {
    props: returnProps
  };
}
