document.addEventListener("DOMContentLoaded", function() {
    function handleFile(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // Read data as JSON without headers
            let jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            // Process the data
            jsonData = processData(jsonData);

            // Map and create the table
            const mappedData = mapData(jsonData);
            createTable(mappedData);
        };

        reader.readAsArrayBuffer(file);
    }

    function processData(data) {
        // Process the data as described
        for (let i = 1; i < data.length; i++) {
            const current = data[i];
            const previous = i > 0 ? data[i - 1] : null;

            const isShipped = current[1] === "Shipped";
            const checkCondition = current.length > 12;

            if (!checkCondition && previous) {
                // Add the country to the previous row
                const country = current[current.length - 1];
                if (typeof country === 'string' && country.trim().length > 0) {
                    previous.push(country);
                } else {
                    previous.push(""); // Handle cases where the country is not a valid string
                }
                data.splice(i, 1); // Remove the current row
                i--; // Adjust index
            } else if (!isShipped) {
                data.splice(i, 1); // Remove rows where status is not "Shipped"
                i--; // Adjust index
            }
        }
        return data;
    }

    function mapData(data) {
        // Define the column headers based on your specific keys
        const headers = [
            "Order ID",
            "No. Order Items",
            "Total Charged",
            "Order Date",
            "Product(s) name",
            "Country"
        ];

        // Assume the first row is a header, check if it contains expected columns
        const firstRow = data[0];
        let headerIndices = {};

        if (firstRow && firstRow[0] === "Order ID") {
            // Map header indices
            headers.forEach(header => {
                const colIndex = firstRow.indexOf(header);
                if (colIndex !== -1) {
                    headerIndices[header] = colIndex;
                }
            });

            // Remove the header row from data
            data.shift();
        }

        // Ensure "Country" column exists in headerIndices
        if (!headerIndices["Country"]) {
            headerIndices["Country"] = headers.length - 1; // Position of the new "Country" column
        }

        // Create an array of objects with the headers as keys
        return data.map(row => {
            const mappedRow = {};
            headers.forEach(header => {
                const colIndex = headerIndices[header];
                mappedRow[header] = colIndex !== undefined && row[colIndex] !== undefined ? row[colIndex] : ""; // Handle missing values
            });
            return mappedRow;
        });
    }

    function createTable(data) {
        console.log("Mapped data:", data);

        const tableContainer = document.getElementById("tableContainer");
        tableContainer.innerHTML = ""; // Clear any existing table

        const table = document.createElement("table");
        const thead = document.createElement("thead");
        const tbody = document.createElement("tbody");

        // Define the column headers based on your specific keys
        const headers = [
            "Order ID",
            "No. Order Items",
            "Total Charged",
            "Order Date",
            "Product(s) name",
            "Country"
        ];

        // Create table headers
        const headerRow = document.createElement("tr");
        headers.forEach(header => {
            const th = document.createElement("th");
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        // Create table rows
        data.forEach(row => {
            const tr = document.createElement("tr");
            headers.forEach(header => {
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

    document.getElementById("fileInput").addEventListener("change", handleFile);
});


// document.addEventListener("DOMContentLoaded", function() {
//     function handleFile(event) {
//         const file = event.target.files[0];
//         if (!file) return;

//         const reader = new FileReader();

//         reader.onload = function (e) {
//             const data = new Uint8Array(e.target.result);
//             const workbook = XLSX.read(data, { type: "array" });
//             const sheetName = workbook.SheetNames[0];
//             const worksheet = workbook.Sheets[sheetName];

//             // Read data as JSON without headers
//             let jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

//             // Process the data
//             jsonData = processData(jsonData);

//             // Map and create the table
//             const mappedData = mapData(jsonData);
//             createTable(mappedData);
//         };

//         reader.readAsArrayBuffer(file);
//     }

//     function processData(data) {
//         for (let i = 1; i < data.length; i++) {
//             const current = data[i];
//             const previous = i > 0 ? data[i - 1] : null;

//             const isShipped = current[1] === "Shipped";
//             const checkCondition = current.length > 12;

//             if (!checkCondition && previous) {
//                 const country = current[current.length - 1];
//                 previous.push(country);
//                 data.splice(i, 1);
//                 i--;
//             } else if (!isShipped) {
//                 data.splice(i, 1);
//                 i--;
//             }
//         }
//         return data;
//     }

//     function mapData(data) {
//         // Define the column headers based on your specific keys
//         const headers = [
//             "Order ID",
//             "No. Order Items",
//             "Total Charged",
//             "Order Date",
//             "Product(s) name",
//             "Country"
//         ];

//         // Check if the first row is the header
//         const firstRow = data[0];
//         let headerIndices = {};
//         if (firstRow && firstRow[0] === "Order ID") {
//             // Map header indices
//             headers.forEach((header, index) => {
//                 const colIndex = firstRow.indexOf(header);
//                 if (colIndex !== -1) {
//                     headerIndices[header] = colIndex;
//                 }
//             });

//             data.shift(); // Remove the header row from data
//         }

//         // Create an array of objects with the headers as keys
//         return data.map(row => {
//             const mappedRow = {};
//             headers.forEach(header => {
//                 const colIndex = headerIndices[header];
//                 mappedRow[header] = colIndex !== undefined && row[colIndex] !== undefined ? row[colIndex] : ""; // Handle missing values
//             });
//             return mappedRow;
//         });
//     }

//     function createTable(data) {
//         console.log("Mapped data:", data);

//         const tableContainer = document.getElementById("tableContainer");
//         tableContainer.innerHTML = ""; // Clear any existing table

//         const table = document.createElement("table");
//         const thead = document.createElement("thead");
//         const tbody = document.createElement("tbody");

//         // Define the column headers based on your specific keys
//         const headers = [
//             "Order ID",
//             "No. Order Items",
//             "Total Charged",
//             "Order Date",
//             "Product(s) name",
//             "Country"
//         ];

//         // Create table headers
//         const headerRow = document.createElement("tr");
//         headers.forEach(header => {
//             const th = document.createElement("th");
//             th.textContent = header;
//             headerRow.appendChild(th);
//         });
//         thead.appendChild(headerRow);

//         // Create table rows
//         data.forEach(row => {
//             const tr = document.createElement("tr");
//             headers.forEach(header => {
//                 const td = document.createElement("td");
//                 td.textContent = row[header] !== null ? row[header] : ""; // Handle null values
//                 tr.appendChild(td);
//             });
//             tbody.appendChild(tr);
//         });

//         table.appendChild(thead);
//         table.appendChild(tbody);
//         tableContainer.appendChild(table);
//     }

//     document.getElementById("fileInput").addEventListener("change", handleFile);
// });


// // document.addEventListener("DOMContentLoaded", function() {
// //     function handleFile(event) {
// //         const file = event.target.files[0];
// //         if (!file) return;

// //         const reader = new FileReader();

// //         reader.onload = function (e) {
// //             const data = new Uint8Array(e.target.result);
// //             const workbook = XLSX.read(data, { type: "array" });
// //             const sheetName = workbook.SheetNames[0];
// //             const worksheet = workbook.Sheets[sheetName];

// //             // Read data as JSON with header row
// //             const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

// //             // Process and map data
// //             const mappedData = mapData(jsonData);

// //             // Create and populate the table
// //             createTable(mappedData);
// //         };

// //         reader.readAsArrayBuffer(file);
// //     }

// //     function mapData(data) {
// //         // Define the column headers based on your specific keys
// //         const headers = [
// //             "Order ID",
// //             "State",
// //             "Customer Email",
// //             "Customer Name",
// //             "No. Order Items",
// //             "Total Charged",
// //             "Order Date",
// //             "Product(s) name",
// //             "Invoice",
// //             "Tracking link(s)",
// //             "Address (shipping)",
// //             "Address (invoice)",
// //             "Customer phone no",
// //             "Presentment currency",
// //             "Settlement currency",
// //             "Settlement exchange rate",
// //             "Settlement total charged",
// //             "Total paid",
// //             "Settlement Total paid",
// //             "Total refunded",
// //             "Settlement Total refunded",
// //             "Country"
// //         ];

// //         // Check if the first row's first element is the header row
// //         const firstRow = data[0];
// //         if (firstRow && firstRow[0] === "Order ID") {
// //             data.shift(); // Remove the header row from data
// //         }

// //         // Create an array of objects with the headers as keys
// //         return data.map(row => {
// //             const mappedRow = {};
// //             headers.forEach((header, index) => {
// //                 mappedRow[header] = row[index] !== undefined ? row[index] : ""; // Handle missing values
// //             });
// //             return mappedRow;
// //         });
// //     }

// //     function createTable(data) {
// //         console.log("Mapped data:", data);

// //         const tableContainer = document.getElementById("tableContainer");
// //         tableContainer.innerHTML = ""; // Clear any existing table

// //         const table = document.createElement("table");
// //         const thead = document.createElement("thead");
// //         const tbody = document.createElement("tbody");

// //         // Define the column headers based on your specific keys
// //         const headers = [
// //             "Order ID",
// //             "State",
// //             "Customer Email",
// //             "Customer Name",
// //             "No. Order Items",
// //             "Total Charged",
// //             "Order Date",
// //             "Product(s) name",
// //             "Invoice",
// //             "Tracking link(s)",
// //             "Address (shipping)",
// //             "Address (invoice)",
// //             "Customer phone no",
// //             "Presentment currency",
// //             "Settlement currency",
// //             "Settlement exchange rate",
// //             "Settlement total charged",
// //             "Total paid",
// //             "Settlement Total paid",
// //             "Total refunded",
// //             "Settlement Total refunded",
// //             "Country"
// //         ];

// //         // Create table headers
// //         const headerRow = document.createElement("tr");
// //         headers.forEach(header => {
// //             const th = document.createElement("th");
// //             th.textContent = header;
// //             headerRow.appendChild(th);
// //         });
// //         thead.appendChild(headerRow);

// //         // Create table rows
// //         data.forEach(row => {
// //             const tr = document.createElement("tr");
// //             headers.forEach(header => {
// //                 const td = document.createElement("td");
// //                 td.textContent = row[header] !== null ? row[header] : ""; // Handle null values
// //                 tr.appendChild(td);
// //             });
// //             tbody.appendChild(tr);
// //         });

// //         table.appendChild(thead);
// //         table.appendChild(tbody);
// //         tableContainer.appendChild(table);
// //     }

// //     document.getElementById("fileInput").addEventListener("change", handleFile);
// // });



// // // document.addEventListener("DOMContentLoaded", function() {
// // //     function handleFile(event) {
// // //         const file = event.target.files[0];
// // //         if (!file) return;

// // //         const reader = new FileReader();

// // //         let jsonData;

// // //         reader.onload = function (e) {
// // //             const data = new Uint8Array(e.target.result);
// // //             const workbook = XLSX.read(data, { type: "array" });
// // //             const sheetName = workbook.SheetNames[0];
// // //             const worksheet = workbook.Sheets[sheetName];

// // //             jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

// // //             // Process the data
// // //             for (let i = 1; i < jsonData.length; i++) {
// // //                 const current = jsonData[i];
// // //                 const previous = i > 0 ? jsonData[i - 1] : null;

// // //                 const isFirstElementNull = current[0] === null;
// // //                 const isShipped = current[1] === "Shipped";

// // //                 const checkCondition = current.length > 12;

// // //                 if (!checkCondition && previous) {
// // //                     const country = current[current.length - 1];
// // //                     previous.push(country);
// // //                     jsonData.splice(i, 1);
// // //                     i--;
// // //                 } else if (!isShipped) {
// // //                     jsonData.splice(i, 1);
// // //                     i--;
// // //                 }
// // //             }

// // //             // Create and populate the table
// // //             createTable(jsonData);
// // //         };

// // //         reader.readAsArrayBuffer(file);
// // //     }

// // //     function createTable(data) {

// // //         console.log("created data:", data)

// // //         const tableContainer = document.getElementById("tableContainer");
// // //         tableContainer.innerHTML = ""; // Clear any existing table

// // //         const table = document.createElement("table");
// // //         const thead = document.createElement("thead");
// // //         const tbody = document.createElement("tbody");

// // //         // Create table headers
// // //         const headerRow = document.createElement("tr");
// // //         data[0].forEach(header => {
// // //             const th = document.createElement("th");
// // //             th.textContent = header;
// // //             headerRow.appendChild(th);
// // //         });
// // //         thead.appendChild(headerRow);

// // //         // Create table rows
// // //         data.slice(1).forEach(row => {
// // //             const tr = document.createElement("tr");
// // //             row.forEach(cell => {
// // //                 const td = document.createElement("td");
// // //                 td.textContent = cell !== null ? cell : ""; // Handle null values
// // //                 tr.appendChild(td);
// // //             });
// // //             tbody.appendChild(tr);
// // //         });

// // //         table.appendChild(thead);
// // //         table.appendChild(tbody);
// // //         tableContainer.appendChild(table);
// // //     }

// // //     document.getElementById("fileInput").addEventListener("change", handleFile);
// // // });



// // // // function handleFile(event) {
// // // //     const file = event.target.files[0];
// // // //     if (!file) return;

// // // //     const reader = new FileReader();

// // // //     let jsonData;

// // // //     reader.onload = function (e) {
// // // //         const data = new Uint8Array(e.target.result);
// // // //         const workbook = XLSX.read(data, { type: "array" });
// // // //         const sheetName = workbook.SheetNames[0];
// // // //         const worksheet = workbook.Sheets[sheetName];

// // // //         jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

// // // //         // Process the data
// // // //         for (let i = 0; i < jsonData.length; i++) {
// // // //             const current = jsonData[i];
// // // //             const previous = i > 0 ? jsonData[i - 1] : null;

// // // //             const isFirstElementNull = current[0] === null;
// // // //             const isShipped = current[1] === "Shipped";

// // // //             const checkCondition = current.length > 12;

// // // //             if (!checkCondition && previous) {
// // // //                 const country = current[current.length - 1];
// // // //                 previous.push(country);
// // // //                 jsonData.splice(i, 1);
// // // //                 i--;
// // // //             } else if (!isShipped) {
// // // //                 jsonData.splice(i, 1);
// // // //                 i--;
// // // //             }
// // // //         }

// // // //         // Create and populate the table
// // // //         createTable(jsonData);
// // // //     };

// // // //     reader.readAsArrayBuffer(file);
// // // // }

// // // // function createTable(data) {
// // // //     const tableContainer = document.getElementById("tableContainer");
// // // //     tableContainer.innerHTML = ""; // Clear any existing table

// // // //     const table = document.createElement("table");
// // // //     const thead = document.createElement("thead");
// // // //     const tbody = document.createElement("tbody");

// // // //     // Create table headers
// // // //     const headerRow = document.createElement("tr");
// // // //     data[0].forEach(header => {
// // // //         const th = document.createElement("th");
// // // //         th.textContent = header;
// // // //         headerRow.appendChild(th);
// // // //     });
// // // //     thead.appendChild(headerRow);

// // // //     // Create table rows
// // // //     data.slice(1).forEach(row => {
// // // //         const tr = document.createElement("tr");
// // // //         row.forEach(cell => {
// // // //             const td = document.createElement("td");
// // // //             td.textContent = cell !== null ? cell : ""; // Handle null values
// // // //             tr.appendChild(td);
// // // //         });
// // // //         tbody.appendChild(tr);
// // // //     });

// // // //     table.appendChild(thead);
// // // //     table.appendChild(tbody);
// // // //     tableContainer.appendChild(table);
// // // // }

// // // // document.getElementById("fileInput").addEventListener("change", handleFile);

// // // // // document.getElementById("fileInput").addEventListener("change", handleFile);

// // // // // function handleFile(event) {
// // // // //     const file = event.target.files[0];
// // // // //     if (!file) return;

// // // // //     const reader = new FileReader();

// // // // //     let jsonData;

// // // // //     reader.onload = function (e) {
// // // // //         const data = new Uint8Array(e.target.result);
// // // // //         const workbook = XLSX.read(data, { type: "array" });
// // // // //         const sheetName = workbook.SheetNames[0];
// // // // //         const worksheet = workbook.Sheets[sheetName];

// // // // //         jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

// // // // //         console.log(jsonData);

// // // // //         for (let i = 0; i < jsonData.length; i++) {
// // // // //             const current = jsonData[i];
// // // // //             const previous = i > 0 ? jsonData[i - 1] : null; // Only access previous if i > 0

// // // // //             const isFirstElementNull = current[0] === null;
// // // // //             const isShipped = current[1] === "Shipped";

// // // // //             console.log("isFirstElementNull:", isFirstElementNull);
// // // // //             console.log("isShipped:", isShipped);

// // // // //             // Condition to determine whether the current row is a full data row or not
// // // // //             const checkCondition = current.length > 12;

// // // // //             if (!checkCondition && previous) {
// // // // //                 // If the first element is null, it may be a country code row
// // // // //                 const country = current[current.length - 1];
// // // // //                 console.log("Country code:", country);

// // // // //                 previous.push(country); // Add the country code to the previous row
// // // // //                 jsonData.splice(i, 1); // Remove the current row
// // // // //                 i--; // Adjust index due to removal
// // // // //             } else if (!isShipped) {
// // // // //                 // Remove the row if the second field is not "Shipped"
// // // // //                 console.log("Removing row because status is not 'Shipped':", current);
// // // // //                 jsonData.splice(i, 1);
// // // // //                 i--; // Adjust index due to removal
// // // // //             }
// // // // //         }
        
// // // // //         console.log(jsonData);
// // // // //     };

// // // // //     reader.readAsArrayBuffer(file);
// // // // // }


// // // // // // function handleFile(event) {
// // // // // //     const file = event.target.files[0];
// // // // // //     if (!file) return;

// // // // // //     const reader = new FileReader();

// // // // // //     let jsonData;

// // // // // //     reader.onload = function (e) {
// // // // // //         const data = new Uint8Array(e.target.result);
// // // // // //         const workbook = XLSX.read(data, { type: "array" });
// // // // // //         const sheetName = workbook.SheetNames[0];
// // // // // //         const worksheet = workbook.Sheets[sheetName];

// // // // // //         jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

// // // // // //         console.log(jsonData);

// // // // // //         for (let i = 1; i < jsonData.length; i++) {
// // // // // //             const current = jsonData[i];
// // // // // //             const previous = jsonData[i - 1];

// // // // // //             const isFirstElementNull = current[0] === null;

// // // // // //             console.log("isFirstElementNull:", isFirstElementNull)

// // // // // //             const checkContidion = current.length > 12 ? true : false;

// // // // // //             if (!checkContidion) {
// // // // // //                 const country = current[current.length - 1];
// // // // // //                 console.log("country code:", country)
// // // // // //                 previous.push(country);
// // // // // //                 jsonData.splice(i, 1);
// // // // // //                 i--;
// // // // // //             }
// // // // // //         }

// // // // // //         console.log(jsonData);

// // // // // //     };





// // // // // //     reader.readAsArrayBuffer(file);
// // // // // // }



// // // // // // function saveJSONFile(data, filename) {
// // // // // //    const json = JSON.stringify(data, null, 2); // Pretty-print JSON with 2 spaces indentation
// // // // // //    const blob = new Blob([json], { type: "application/json" });
// // // // // //    const url = URL.createObjectURL(blob);
// // // // // //    const a = document.createElement("a");
// // // // // //    a.href = url;
// // // // // //    a.download = filename;
// // // // // //    a.click();
// // // // // //    URL.revokeObjectURL(url);
// // // // // // }