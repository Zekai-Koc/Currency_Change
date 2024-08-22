// tableCreator.js
export function createTable(data) {
    const tableContainer = document.getElementById("tableContainer");
    tableContainer.innerHTML = ""; // Clear any existing table
 
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");
 
    const headers = [
       "Order ID",
       "No. Order Items",
       "Total Charged",
       "Order Date",
       "Product(s) name",
       "Country",
       "Factor",
    ];
 
    const headerRow = document.createElement("tr");
    headers.forEach((header) => {
       const th = document.createElement("th");
       th.textContent = header;
       headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
 
    data.forEach((row) => {
       const tr = document.createElement("tr");
       headers.forEach((header) => {
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
 