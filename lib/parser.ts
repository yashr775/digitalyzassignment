/* eslint-disable @typescript-eslint/no-explicit-any */
import Papa from "papaparse";
import * as XLSX from "xlsx";

export async function parseFile(file: File): Promise<any[]> {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext === "csv") return parseCSV(file);
  if (ext === "xlsx") return parseXLSX(file);
  throw new Error("Unsupported file type");
}

function parseCSV(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: res => resolve(res.data),
      error: err => reject(err),
    });
  });
}

function parseXLSX(file: File): Promise<any[]> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      resolve(XLSX.utils.sheet_to_json(firstSheet));
    };
    reader.readAsArrayBuffer(file);
  });
}
