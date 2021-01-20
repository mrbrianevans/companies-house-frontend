import { GetServerSideProps } from "next";
import { ICompany } from "../../types/ICompany";

const CompanyDetails = ({
                          companyData,
                          apiResponseTime
                        }: { companyData: ICompany, apiResponseTime: number }) => {
  return (
    <div className={"container"}>
      <h1>Details for company {companyData.name}</h1>
      <h4>{companyData.status} - {companyData.category}</h4>
      <h3>Company number {companyData.number}</h3>
      <div>
        <p>{companyData.streetAddress}</p>
        <p>{companyData.county}</p>
        <p>{companyData.postCode}</p>
        <p>{companyData.county}</p>
        <p>{companyData.origin}</p>
      </div>
      <div>
        <h3>Sic Codes:</h3>
        <ul>
          {companyData.sicCodes?.map(sicCode => (<li>{sicCode["sic_code"]}</li>))}
        </ul>
      </div>
      <div className={"responseTime"}>API response time: {apiResponseTime}ms</div>
    </div>
  );
};

export default CompanyDetails;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const companyNumber = context.params.number.toString();
  if (!companyNumber.match(/^[0-9]{6,8}$/)) //TODO: Needs to include letters like SC and FR for charities
    return {
      redirect: {
        destination: "/search/" + companyNumber,
        permanent: false // not sure what this does??
      }
    };
  const startTime = Date.now();
  // fetch company data from backend
  const apiURL = "http://localhost:8080/api/company/" + companyNumber;
  // const apiURL = "http://" + context.req.headers.host + "/api/company/" + companyNumber;
  console.time("Fetch " + apiURL);
  const apiResponse = await fetch(apiURL);
  let companyData: ICompany;
  if (apiResponse.status === 200) {
    const apiJSON = await apiResponse.json();
    companyData = apiJSON["company"];
  } else {
    companyData = {
      category: "",
      country: "",
      county: "",
      date: new Date().toString(),
      number: "",
      origin: "",
      postCode: "",
      status: "",
      streetAddress: "",
      name: "error occured"
    };
  }
  // console.timeLog("Fetch " + apiURL, companyData);
  console.timeEnd("Fetch " + apiURL);
  return {
    props: { companyData, apiResponseTime: Date.now() - startTime } // will be passed to the page component as props
  };
};
