import { GetServerSideProps } from "next";
import { ICompany } from "../../types/ICompany";

const CompanyDetails = ({ companyData }: { companyData: ICompany }) => {
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
          <li>{companyData.SicCode1 || ""}</li>
          <li>{companyData.SicCode2 || ""}</li>
          <li>{companyData.SicCode3 || ""}</li>
          <li>{companyData.SicCode4 || ""}</li>
        </ul>
      </div>
    </div>
  );
};

export default CompanyDetails;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const companyNumber = context.params.number.toString();
  if (!companyNumber.match(/^[0-9]{6,8}$/))
    return {
      redirect: {
        destination: "/search/" + companyNumber,
        permanent: false // not sure what this does??
      }
    };
  // fetch company data from backend
  const apiURL = "http://" + context.req.headers.host + "/api/company/" + companyNumber;
  console.time("Fetch " + apiURL);
  const companyData: ICompany = await fetch(apiURL).then(res => res.json());
  console.timeEnd("Fetch " + apiURL);
  console.timeLog("Fetch " + apiURL, companyData);
  return {
    props: { companyData } // will be passed to the page component as props
  };
};
