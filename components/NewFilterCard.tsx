import * as React from "react";
import { useState } from "react";
import { IFilter, IFilterOption } from "../types/IFilters";

const styles = require("../styles/Home.module.css");
type Props = {
  addFilter: (filter: IFilter) => void
  filterOptions: IFilterOption[]
}

export function NewFilterCard(props: Props) {
  const filterOptions: IFilterOption[] = props.filterOptions;
  const [
    selectedFilterOption,
    setSelectedFilterOption
  ] = useState<IFilterOption>(filterOptions[0]);
  const [comparison, setComparison] = useState<IFilter["comparison"]>(
    selectedFilterOption.possibleComparisons[0]
  );
  const [min, setMin] = useState(-1000);
  const [max, setMax] = useState(1000);
  const [exclude, setExclude] = useState(false);
  const [values, setValues] = useState([]);
  const [typingValue, setTypingValue] = useState("");

  const validateSelectedFilterCriteria = (
    selectedFilterOption: IFilterOption,
    selectedFilterCriteria: IFilter["comparison"]
  ) => {

    if ( // @ts-ignore i'm not so great with this kind of typescript
      selectedFilterOption.possibleComparisons.includes(selectedFilterCriteria)
    )
      return selectedFilterCriteria;
    else return selectedFilterOption.possibleComparisons[0];
  };
  const addFilter = () => {
    if (selectedFilterOption.valueType === "number")
      props.addFilter({
        category: selectedFilterOption.category,
        comparison: "is between",
        type: "number",
        min,
        max,
        exclude
      });
    else if (selectedFilterOption.valueType === "string") {
      // @ts-ignore i'm sorry, i'm checking this manually
      props.addFilter({
        category: selectedFilterOption.category,
        comparison: comparison,
        type: "string",
        values,
        exclude
      });
    }
  };
  const addValue = (value: string) => {
    if (value.length) setValues((prevState) => [...prevState, value]);
  };
  return (
    <div className={styles.card} style={{ width: "100%" }}>
      <h3>Add new filter</h3>
      <div>
        <label>
          Exclude?{" "}
          <input
            type={"checkbox"}
            checked={exclude}
            onChange={(v) => setExclude(v.target.checked)}
          />
        </label>
        <select
          value={selectedFilterOption.category}
          onChange={(e) => {
            const selectedOption = filterOptions.find(
              (option) => option.category === e.target.value
            );
            setSelectedFilterOption(selectedOption);
            setComparison(
              validateSelectedFilterCriteria(selectedOption, comparison)
            );
          }}>
          {filterOptions.map((filterOption) => (
            <option key={filterOption.category}>{filterOption.category}</option>
          ))}
        </select>
        <select
          value={comparison}
          onChange={(v) => {
            if (
              "begins with" == v.target.value ||
              v.target.value === "includes" ||
              v.target.value === "is exactly"
            )
              setComparison(v.target.value);
          }}>
          {
            // @ts-ignore
            selectedFilterOption.possibleComparisons.map(
              (criterion: IFilter["comparison"]) => (
                <option key={criterion}>{criterion}</option>
              )
            )
          }
        </select>
        {selectedFilterOption.valueType === "number" ? (
          <>
            <input
              type={"number"}
              value={min}
              onChange={(v) => setMin(Number(v.target.value))}
            />
            <span> and </span>
            <input
              type={"number"}
              value={max}
              onChange={(v) => setMax(Number(v.target.value))}
            />
          </>
        ) : (
          <>
            <input
              type={"text"}
              value={typingValue}
              onChange={(v) => setTypingValue(v.target.value)}
            />
            <button
              onClick={() => {
                addValue(typingValue.trim());
                setTypingValue("");
              }}>
              Another one
            </button>
          </>
        )}
        <p>
          {exclude ? "Exclude" : "Only show"} accountants where{" "}
          {selectedFilterOption.category} {comparison}{" "}
          {selectedFilterOption.valueType === "number"
            ? min + " and " + max
            : values.join(" or ")}
        </p>

        <button onClick={addFilter}>Add filter</button>
      </div>
    </div>
  );
}
