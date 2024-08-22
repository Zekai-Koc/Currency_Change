import { createTable } from './tableCreator.js';
import { fetchFactors } from './factorsFetcher.js';

let mappedData = [];

export async function processAndDisplayData(jsonData) {
   jsonData = processData(jsonData);
   mappedData = mapData(jsonData);

   const factors = await fetchFactors(); // Fetch factors from JSON file

   mappedData = addFactorColumn(mappedData, factors); // Add the Factor column
   createTable(mappedData);
}

function processData(data) {
   // Processing logic here...
}

function mapData(data) {
   return data.map((row) => {
      let totalCharged = row[5];

      if (typeof totalCharged === "string") {
         totalCharged = totalCharged
            .replace(/\s[A-Z]{3}/, "")
            .replace(".", ",");
      }

      return {
         "Order ID": row[0],
         "No. Order Items": row[4],
         "Total Charged": totalCharged,
         "Order Date": row[6],
         "Product(s) name": row[7],
         Country: row[row.length - 1],
      };
   });
}

function addFactorColumn(mappedData, factors) {
   return mappedData.map((row) => {
      const country = row.Country;
      const factor = factors[country] || "";
      row.Factor = factor;
      return row;
   });
}

export { mappedData };
