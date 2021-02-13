import { Page } from "../../components/Page";
import * as React from "react";
import { useState } from "react";
import { NewFilterCard } from "../../components/NewFilterCard";
import { IFilter, IFilterOption } from "../../types/IFilters";
import { GetServerSideProps } from "next";
import { IAccountant } from "../../types/IAccountant";

const styles = require("../../styles/Home.module.css");

const formStyles = require("../../styles/form.module.css");

interface Props {
  filterOptions: IFilterOption[]
}

const AccountantFilterPage = ({ filterOptions }: Props) => {
  const [showNewFilterForm, setShowNewFilterForm] = useState<boolean>(
    filterOptions.length > 0
  );
  const [filters, setFilters] = useState<IFilter[]>([]);
  const addFilter = (filter: IFilter) => {
    setShowNewFilterForm(false);
    setFilters((prevState) => [filter, ...prevState]);
    setTimeout(() => {
      setShowNewFilterForm(true);
    }, 1);
  };
  const [filterMatchesLoading, setFilterMatchesLoading] = useState(false);
  const [requestResponseTime, setRequestResponseTime] = useState<number | undefined>();
  let clearRequestResponseTimer: NodeJS.Timeout | undefined;
  const applyFilter = () => {
    // console.log('Requesting filter from backend: ', filters)
    const requestFilterTime = Date.now();
    if (clearRequestResponseTimer) clearTimeout(clearRequestResponseTimer);
    setFilterMatchesLoading(true);
    // fetch("http://localhost:8080/api/accountants/filter", {
    fetch("/api/accountants/filter", {
      method: "POST",
      body: JSON.stringify(filters),
      headers: { "Content-Type": "application/json" }
    })
      .then((r) => {
        if (r.status === 200) return r;
        else throw new Error(JSON.stringify(r.json()));
      })
      .then((r) => r.json())
      .then((j: IAccountant[]) => setMatchingAccountants(j))
      .then(() => setRequestResponseTime(Date.now() - requestFilterTime))
      .catch(console.error)
      .finally(() => setFilterMatchesLoading(false));
  };
  const [matchingAccountants, setMatchingAccountants] = useState<IAccountant[]>();
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
            <h3>
              Filter {i + 1} - {filter.category}
              <button
                style={{
                  float: "right",
                  backgroundColor: "#3b4f59"
                }}
                className={formStyles.icon}
                onClick={() =>
                  setFilters((prevState) =>
                    prevState.filter((value, index) => index !== i)
                  )
                }>
                <img
                  src={
                    "https://companies-house.fra1.digitaloceanspaces.com/remove_icon.svg"
                  }
                  style={{ width: "1rem", height: "1rem" }}
                  alt={"remove icon"}
                  loading={"lazy"}
                />
              </button>
            </h3>
            <p>
              {filter.exclude ? "Exclude" : "Only show"} accountants where{" "}
              {filter.category} {filter.comparison}{" "}
              {filter.type === "number"
                ? filter.min + " and " + filter.max
                : filter.values.join(" or ")}
            </p>
          </div>
        ))}
        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <button
            onClick={applyFilter}
            className={formStyles.pill + " " + formStyles.success}
            style={{ padding: "1rem", width: "10em" }}>
            Apply filter
          </button>
        </div>
        {filterMatchesLoading && (
          <div className={styles.card}>
            <h2>Loading...</h2>
          </div>
        )}
        {matchingAccountants && !filterMatchesLoading && (
          <div style={{ width: "100%" }} className={styles.card}>
            <h2>Filter results</h2>
            <pre>{requestResponseTime}ms response time</pre>
            <table style={{ width: "100%" }}>
              <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Company Number</th>
                <th>Location</th>
                <th>Age</th>
                <th>Software</th>
                <th>Number of clients</th>
              </tr>
              </thead>
              <tbody>
              {matchingAccountants?.map((accountant, index) => (
                <tr key={index}>
                  <td style={{ textAlign: "right" }}>
                      <span style={{ paddingRight: 20, paddingLeft: 0 }}>
                        {index + 1}
                      </span>
                  </td>
                  <td>
                    {accountant.name
                      .split(" ")
                      .slice(0, accountant.name.split(" ").length - 1)
                      .join(" ")}
                  </td>
                  <td>
                    <a
                      href={"/company/" + accountant.company_number}
                      target={"_blank"}>
                      {accountant.company_number}
                    </a>
                  </td>
                  <td>{accountant.area}</td>
                  <td>
                    {Math.round(
                      (Date.now() - new Date(accountant.date).valueOf()) /
                      (86400 * 1000 * 365)
                    )}{" "}
                    years
                  </td>
                  <td>
                    {(accountant.software[0]?.split(" ")[0] || "") +
                    (accountant.software?.length > 1
                      ? ` and ${accountant.software?.length - 1} other${
                        accountant.software?.length - 1 > 1 ? "s" : ""
                      }`
                      : "")}
                  </td>
                  <td>{accountant.number_of_clients}</td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        )}
        <div className={styles.card}>
          <img
            src={
              "https://companies-house.fra1.digitaloceanspaces.com/sqlScreenshot.svg"
            }
            alt={"Screenshot of example SQL query to filter for accountants"}
            style={{ width: "100%" }}
          />
        </div>
      </div>
    </Page>
  )
}

export default AccountantFilterPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const returnProps: Props = {
    // filterOptions: [{category: "an error has occurred", possibleComparisons: ["is exactly"], valueType: 'string'}]
    filterOptions: []
  }
  const filterOptionsRequest = await fetch(
    "http://localhost:8080/api/accountants/getFilters"
  )
  if (filterOptionsRequest.status === 200)
    returnProps.filterOptions = await filterOptionsRequest.json();
  return {
    props: returnProps
  }
}
