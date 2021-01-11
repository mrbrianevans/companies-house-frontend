import { Page } from "../components/Page";
import { TextInputWithButton } from "../components/TextInputWithButton";

const styles = require("../styles/Home.module.css");

const SearchPage = () => {
  const searchByName = (name: string) => {
    fetch(name);
  };
  return (
    <Page>
      <h1>Search</h1>
      <div className={styles.grid}>
        <div className={styles.card} style={{ width: "100%" }}>
          <h3>
            <label htmlFor={"companyNumberSearchBox"}>Company number</label>
          </h3>
          <TextInputWithButton textBoxPlaceholder={"05792439"}
                               buttonLink={(v) => ("search/" + v)} />

        </div>
        <div className={styles.card}>
          <h3>
            <label htmlFor={"companyNameSearchBox"}>Company name</label>
          </h3>
          <TextInputWithButton textBoxPlaceholder={"Polo Rocks"} />
        </div>
      </div>
    </Page>
  );
};

export default SearchPage;
