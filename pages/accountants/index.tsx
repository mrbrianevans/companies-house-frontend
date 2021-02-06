import { Page } from "../../components/Page";
import { useEffect, useState } from "react";

const styles = require("../../styles/Home.module.css");

interface IFilterOption {
  code: string;
  possibleCriteria: string[];
  label: string
}

const SearchPage = () => {

  const filterOptions: IFilterOption[] = [
    {
      label: "Production software",
      possibleCriteria: ["includes", "excludes"],
      code: "software"
    },
    {
      label: "Number of clients",
      possibleCriteria: ["is less than", "is greater than"],
      code: "clientQty"
    }
  ];
  const [selectedFilterOption, setSelectedFilterOption] = useState(filterOptions[0]);
  const [selectedFilterCriteria, setSelectedFilterCriteria] = useState(selectedFilterOption.possibleCriteria[0]);
  const [criteriaValue, setCriteriaValue] = useState("");
  const validateSelectedFilterCriteria = (selectedFilterOption: IFilterOption, selectedFilterCriteria: string) => {
    if (selectedFilterOption.possibleCriteria.includes(selectedFilterCriteria)) return selectedFilterCriteria;
    else return selectedFilterOption.possibleCriteria[0];
  };
  useEffect(() => {
    console.log("Changed filter criteria to", selectedFilterCriteria);
  }, [selectedFilterCriteria]);
  //todo:
  // - separate "New Filter" card into its own component
  // - add a type (number|string) to the text box to only accept appropriate input for each option
  // - store filters in an array, and map that array to cards below the create new card
  // - send a post request when the user submits the filters
  return (
    <Page>
      <h1>Accountants</h1>
      <div className={styles.grid}>
        <div className={styles.card} style={{ width: "100%" }}>
          <h3>
            Add new filter
          </h3>
          <p>Current filter:
            where {selectedFilterOption.label} {selectedFilterCriteria} {criteriaValue}</p>
          <div>
            <select
              value={selectedFilterOption.code}
              onChange={(e) => {
                const selectedOption = filterOptions.find((option) => option.code === e.target.value);
                setSelectedFilterOption(selectedOption);
                setSelectedFilterCriteria(validateSelectedFilterCriteria(selectedOption, selectedFilterCriteria));
              }}>
              {filterOptions.map(filterOption => <option
                value={filterOption.code}>{filterOption.label}</option>)}
            </select>
            <select value={selectedFilterCriteria}
                    onChange={v => setSelectedFilterCriteria(v.target.value)}>
              {selectedFilterOption.possibleCriteria.map(criterion => <option>{criterion}</option>)}
            </select>
            <input type={"text"} value={criteriaValue}
                   onChange={v => setCriteriaValue(v.target.value)}
                   onSelect={v => setCriteriaValue(v.currentTarget.value)} />
            <button onClick={() => {
              console.log("Adding a filter for accountants where", selectedFilterOption.label, selectedFilterCriteria, criteriaValue);
            }}>Add filter
            </button>
          </div>
        </div>
        <div className={styles.card} style={{ width: "100%" }}>
          <h3>
            Already added filters
          </h3>
          <p>Software</p>
          <p>Include</p>
          <p>Companies house</p>
        </div>
      </div>
      <button>Apply filter</button>
    </Page>
  );
};

export default SearchPage;
