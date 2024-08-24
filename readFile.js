function readFile(file) {
   return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function (e) {
         try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            const jsonData = XLSX.utils.sheet_to_json(worksheet, {
               header: 1,
            });
            resolve(jsonData);
         } catch (error) {
            reject(error);
         }
      };
      reader.onerror = function () {
         reject(new Error("File reading failed"));
      };
      reader.readAsArrayBuffer(file);
   });
}
