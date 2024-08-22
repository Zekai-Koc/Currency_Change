document.addEventListener("DOMContentLoaded", function () {
   document
      .getElementById("fileInput")
      .addEventListener("change", function (event) {
         handleFileSelection(event, processAndDisplayData);
      });

   document
      .getElementById("exportButton")
      .addEventListener("click", function () {
         exportToExcel(mappedData);
      });

   let mappedData = []; // Declare mappedData as a global variable
   const shipments = {
      AT: 12.22,
      BE: 8.13,
      BG: 15,
      IT: 11.54,
      DE: 8.45,
      DK: 12.33,
      SE: 16.79,
      NL: 6.6,
   };

   function handleFileSelection(event, callback) {
      const file = event.target.files[0];
      if (!file) return;

      readFile(file, callback);
   }

   function readFile(file, callback) {
      const reader = new FileReader();

      reader.onload = function (e) {
         const data = new Uint8Array(e.target.result);
         const workbook = XLSX.read(data, { type: "array" });
         const sheetName = workbook.SheetNames[0];
         const worksheet = workbook.Sheets[sheetName];

         const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

         // console.log(jsonData)

         callback(jsonData);
      };

      reader.readAsArrayBuffer(file);
   }

   async function processAndDisplayData(jsonData) {
      jsonData = processData(jsonData);

      mappedData = mapData(jsonData);

      // const factors = await fetchFactors(); // Fetch factors from JSON file
      mappedData = addShipmentColumn(mappedData, shipments); // Add the Factor column
      createTable(mappedData);
   }

   function processData(data) {
      for (let i = 0; i < data.length; i++) {
         const current = data[i];
         const previous = i > 0 ? data[i - 1] : null;

         const isShipped = current[1] === "Shipped";

         let isCountryRow = current[0] === null || current[0] === undefined;

         if (isCountryRow && previous) {
            const country = current[current.length - 1];

            if (typeof country === "string" && country.trim().length === 2) {
               previous.push(country);
            } else {
               previous.push("");
            }

            data.splice(i, 1);
            i--;
         } else if (!isShipped) {
            data.splice(i, 1);
            i--;
         }
      }

      data[data.length - 1].pop();

      return data;
   }

   function mapData(data) {
      return data.map((row) => {
         let totalCharged = row[7];

         if (typeof totalCharged === "string") {
            totalCharged = totalCharged
               .replace(/\s[A-Z]{3}/, "")
               .replace(".", ",");
         }

         return {
            "Order ID": row[0],
            "No. Order Items": row[6],
            "Total Charged": totalCharged,
            "Order Date": row[8],
            "Product(s) name": row[11],
            IMEI: row[13],
            Country: row[row.length - 1],
         };
      });
   }

   function addShipmentColumn(mappedData, shipments) {
      return mappedData.map((row) => {
         const country = row.Country;
         const shipment = shipments[country] || "";
         row.Shipment = shipment;
         return row;
      });
   }

   function createTable(data) {
      const tableContainer = document.getElementById("tableContainer");
      tableContainer.innerHTML = "";

      const table = document.createElement("table");
      const thead = document.createElement("thead");
      const tbody = document.createElement("tbody");

      // Define headers, including the new "#" column
      const headers = [
         "#", // New column for row numbers
         "Order ID",
         "No. Order Items",
         "Total Charged",
         "Order Date",
         "Product(s) name",
         "IMEI",
         "Country",
         "Shipment",
      ];

      // Create header row
      const headerRow = document.createElement("tr");
      headers.forEach((header) => {
         const th = document.createElement("th");
         th.textContent = header;
         headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);

      // Create table rows with row numbers
      data.forEach((row, index) => {
         const tr = document.createElement("tr");

         // Create the first column with the row number
         const rowNumberTd = document.createElement("td");
         rowNumberTd.textContent = index + 1; // Row numbers starting from 1
         tr.appendChild(rowNumberTd);

         // Add the rest of the data columns
         headers.slice(1).forEach((header) => {
            const td = document.createElement("td");
            td.textContent = row[header] !== null ? row[header] : ""; // Handle null values
            tr.appendChild(td);
         });

         tbody.appendChild(tr);
      });

      table.appendChild(thead);
      table.appendChild(tbody);
      tableContainer.appendChild(table);
   }

   function exportToExcel(data, filename = "exported_data.xlsx") {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, filename);
   }
});
