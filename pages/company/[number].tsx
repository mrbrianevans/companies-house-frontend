import { GetServerSideProps } from "next";
import { ICompany } from "../../types/ICompany";

const CompanyDetails = ({ companyData }: { companyData: ICompany }) => {
  return (
    <div className={"container"}>
      <h1>Details for company {companyData.name}</h1>
      <h3>Company number {companyData.number}</h3>
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
  console.log("Fetching: " + apiURL);
  const companyData: ICompany = await fetch(apiURL).then(res => res.json());
  console.log("Received response from API:");
  console.log(companyData);
  return {
    props: { companyData } // will be passed to the page component as props
  };
};
