/* eslint-disable @typescript-eslint/no-explicit-any */
import { utils, writeFileXLSX } from "xlsx";

export function exportCSV(data: any[], filename: string) {
  const ws = utils.json_to_sheet(data);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, "Sheet1");
  writeFileXLSX(wb, filename);
}

export function exportJSON(obj: any, filename: string) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
}
