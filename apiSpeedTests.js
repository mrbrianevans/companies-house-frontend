const { ApiError } = require("next/dist/next-server/server/api-utils");
const axios = require("axios").default;

const runSpeedTest = async (companyNumbers, baseUrl, config, urlSuffix) => {
  console.log(`\n\nTesting URL: ${baseUrl}`);

  if (companyNumbers) {
    const times = [];
    for (let i = 0; i < companyNumbers.length; i++) {
      const companyNumber = companyNumbers[i].companyNumber;
      try {
        // console.time(`Call API on ${companyNumber}`);
        const startTime = Date.now();
        const res = await axios.get(`${baseUrl}${companyNumber}${urlSuffix || ""}`, config || {});
        if (res.status !== 200) throw new ApiError(res.status, res.statusText);
        times.push(Date.now() - startTime);
        process.stdout.write("\x1b[32m-\x1b[0m");
        // console.timeEnd(`Call API on ${companyNumber}`)
      } catch (e) {
        if (e.code === "ECONNREFUSED") {
          console.error("You need to start the server");
          return;
        } else {
          // console.error(`Error with this API on number ${companyNumber}`);
          // console.error(e);
          process.stdout.write("\x1b[31m|\x1b[0m");
        }
      }
    }
    console.log();
    // console.log("Times: ");
    // console.log(times)
    let average = 0;
    times.forEach(time => {
      average += time;
    });
    average = Math.round(average / times.length);
    console.log(`${times.length} OK calls. Min: ${Math.min(...times)}ms , Max: ${Math.max(...times)}ms , Average: ${average}ms`);
  }
};

const runComparisonSpeedTests = async (qty) => {

  const randomGeneratorURL = "https://brianevans.tech/projects/companies-house/database/controller.php?action=random-company-numbers&qty=" + qty;
  let companyNumbers;
  try {
    console.time(`Fetch ${qty} random numbers`);
    companyNumbers = (await axios.get(randomGeneratorURL)).data;
    console.timeEnd(`Fetch ${qty} random numbers`);
  } catch (e) {
    console.log("Due to error with brianevans.tech, could not fetch random company numbers");
    // console.log(e)
  }

  const companiesHouseAPI = "http://data.companieshouse.gov.uk/doc/company/";
  const dev = "http://localhost:8080/api/company/";
  const production = "https://companies-house-frontend-api-rmfuc.ondigitalocean.app/api/company/";
  const brianevans = "https://brianevans.tech/projects/companies-house/database/controller.php?action=company-api&number=";

  const companiesHouseApiKey = "dB7bNOkkBwiC3TB8R-QfcLzWuCzP-gPT-sXAtuP1";
  const companiesHouseApiAuthed = "https://api.company-information.service.gov.uk/company/";

  await runSpeedTest(companyNumbers, companiesHouseAPI, {}, ".json");
  await runSpeedTest(companyNumbers, companiesHouseApiAuthed, {
    auth: {
      username: companiesHouseApiKey,
      password: ""
    }
  });
  await runSpeedTest(companyNumbers, dev);
  await runSpeedTest(companyNumbers, production);
  await runSpeedTest(companyNumbers, brianevans);
};

runComparisonSpeedTests(30);
