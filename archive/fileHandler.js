// fileHandler.js
import { processAndDisplayData } from './dataProcessor.js';

export function handleFileSelection(event) {
   const file = event.target.files[0];
   if (!file) return;

   readFile(file, processAndDisplayData);
}

function readFile(file, callback) {
   const reader = new FileReader();

   reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      callback(jsonData);
   };

   reader.readAsArrayBuffer(file);
}
