// exporter.js
import { mappedData } from './dataProcessor.js';

export function exportToExcel(data = mappedData, filename = "exported_data.xlsx") {
   const worksheet = XLSX.utils.json_to_sheet(data);
   const workbook = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
   XLSX.writeFile(workbook, filename);
}
