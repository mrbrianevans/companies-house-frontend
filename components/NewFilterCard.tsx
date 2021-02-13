import * as React from "react";
import { useState } from "react";
import { IFilter, IFilterOption } from "../types/IFilters";

const styles = require("../styles/Home.module.css");
const formStyles = require("../styles/form.module.css");
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
    if (
      // @ts-ignore i'm not so great with this kind of typescript
      selectedFilterOption.possibleComparisons.includes(selectedFilterCriteria)
    )
      return selectedFilterCriteria;
    else return selectedFilterOption.possibleComparisons[0];
  };
  const addValue = (value: string) => {
    if (value.length) setValues((prevState) => [...prevState, value]);
  }
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
        values: [...values, typingValue].filter((v) => v),
        exclude
      });
    }
  }
  return (
    <div className={styles.card} style={{ width: "100%" }}>
      <h3>Add new filter</h3>
      <div>
        <div className={formStyles.formrow}>
          {/*<label>*/}
          {/*  Exclude?{" "}*/}
          {/*  <input*/}
          {/*    type={"checkbox"}*/}
          {/*    checked={exclude}*/}
          {/*    onChange={(v) => setExclude(v.target.checked)}*/}
          {/*  />*/}
          {/*</label>*/}
          <select
            className={formStyles.standard}
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
              <option key={filterOption.category}>
                {filterOption.category}
              </option>
            ))}
          </select>
          <select
            className={formStyles.standard}
            value={comparison}
            onChange={(v) => {
              if (
                "begins with" == v.target.value ||
                v.target.value === "includes" ||
                v.target.value === "is exactly" ||
                v.target.value === "ends with"
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
                className={formStyles.standard}
                type={"number"}
                value={min}
                onChange={(v) => setMin(Number(v.target.value))}
              />
              <span> and </span>
              <input
                className={formStyles.standard}
                type={"number"}
                value={max}
                onChange={(v) => setMax(Number(v.target.value))}
              />
            </>
          ) : (
            <>
              <input
                className={formStyles.standard}
                list={"filter-suggestions"}
                type={"text"}
                value={typingValue}
                onChange={(v) => setTypingValue(v.target.value)}
              />
              <datalist id={"filter-suggestions"}>
                {selectedFilterOption.suggestions?.map((suggestion) => (
                  <option>{suggestion}</option>
                ))}
              </datalist>
              <button
                onClick={() => {
                  addValue(typingValue.trim());
                  setTypingValue("");
                }}
                style={{ display: "inline-grid" }}
                className={formStyles.icon + " " + formStyles.success}>
                +
              </button>
            </>
          )}
        </div>
        <p>
          {exclude ? "Exclude" : "Only show"} accountants where{" "}
          {selectedFilterOption.category} {comparison}{" "}
          {selectedFilterOption.valueType === "number"
            ? min + " and " + max
            : values.join(" or ")}
        </p>

        <button
          onClick={addFilter}
          className={formStyles.pill + " " + formStyles.success}>
          {" "}
          +{" "}
        </button>
      </div>
    </div>
  )
}
