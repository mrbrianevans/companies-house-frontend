import { Page } from "../components/Page";
import { TextInputWithButton } from "../components/TextInputWithButton";

const styles = require("../styles/Home.module.css");

const SearchPage = () => {
  const getSearchLink = (value: string) => {
    if (value.match(/^[0-9]{6,8}$/))
      //TODO: include numbers which start with 2 letters such as SC or FR for charities
      return "company/" + value;
    else return "search/" + value;
  }
  return (
    <Page>
      <h1>Search</h1>
      <div className={styles.grid}>
        <div className={styles.card} style={{ width: "100%" }}>
          <h3>
            <label htmlFor={"companyNumberSearchBox"}>
              Company number or name
            </label>
          </h3>
          <TextInputWithButton
            textBoxPlaceholder={"05792439 or Tesco"}
            buttonLink={getSearchLink}
            buttonText={"Search!"}
            textBoxId={"companyNumberSearchBox"}
          />
        </div>
      </div>
    </Page>
  )
}

export default SearchPage;
