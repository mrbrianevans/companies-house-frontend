import { IFilter, INumberFilter, IStringFilter } from "../types/IFilters";

interface IMinorQuery {
  query: string
  value: any[]
}

const filterByName: (filter: IStringFilter) => IMinorQuery = (filter) => {
  const query = `
      SELECT *
      FROM accountants
      WHERE lower(name) LIKE ANY (?)
  `;
  const value = getValues(filter);
  return { query, value };
};
const filterBySoftware: (filter: IStringFilter) => IMinorQuery = (filter) => {
  const query = `
      SELECT *
      FROM accountants
      WHERE software && (?)
  `;
  const value = [filter.values];
  return { query, value };
};
const filterByNumberOfClients: (filter: INumberFilter) => IMinorQuery = (
  filter
) => {
  const query = `
      SELECT *
      FROM accountants
      WHERE accountants.number_of_clients BETWEEN ? AND ?
  `;
  const value = [filter.min, filter.max];
  return { query, value };
};

const filterByLocation: (filter: IStringFilter) => IMinorQuery = (filter) => {
  const query = `
      SELECT a.name, a.company_number, a.software, a.number_of_clients
      FROM accountants a,
           companies c,
           postcode_summary p
      WHERE a.company_number = c.number
        AND c.postcode LIKE p.postcode_prefix || '%'
        AND lower(p.area) LIKE ANY (?)
  `;
  const value = getValues(filter);
  return { query, value };
};

const filterByClientCompanyNumber: (filter: IStringFilter) => IMinorQuery = (
  filter
) => {
  const query = `
      SELECT a.name, a.company_number, a.software, a.number_of_clients
      FROM accounts acc,
           accountants a
      WHERE acc.value = a.name
        AND acc.label = 'Name of entity accountants'
        AND acc.company_number LIKE ANY (?)
  `;
  const value = [filter.values];
  return { query, value };
};

const filterMap = new Map<string, (filter: IFilter) => IMinorQuery>();
filterMap.set("production software", filterBySoftware);
filterMap.set("number of clients", filterByNumberOfClients);
filterMap.set("location", filterByLocation);
filterMap.set("name", filterByName);
filterMap.set("client company number", filterByClientCompanyNumber);
export default filterMap;

const getValues = (filter: IStringFilter) => {
  return [
    filter.values.map((value) => {
      switch (filter.comparison) {
        case "begins with":
          return value.toLowerCase() + "%";
        case "ends with":
          return "%" + value.toLowerCase();
        case "includes":
          return "%" + value.toLowerCase() + "%";
        case "is exactly":
          return value.toLowerCase();
      }
    })
  ];
};
