/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  AllCommunityModule,
  themeQuartz,
} from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

type Props = {
  rowData: any[];
  columnDefs: any[];
};

export default function DataGridComp({ rowData, columnDefs }: Props) {
  return (
    <div style={{ width: "100%", height: 400 }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={{ flex: 1, editable: true, resizable: true }}
        theme={themeQuartz}
      />
    </div>
  );
}
