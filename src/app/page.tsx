/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import FileUpload from "../../components/FileUpload";
import DataGridComp from "../../components/DataGrid";
import ValidationSummary from "../../components/ValidationSummary";
import { parseFile } from "../../lib/parser";
import { validateAll, ValidationError } from "../../lib/validators";
import { exportCSV, exportJSON } from "../../lib/export";
import RuleBuilder from "../../components/RuleBuilder";
import PrioritySliders from "../../components/PrioritySliders";

export default function Home() {
  const [clients, setClients] = useState<any[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  // New: keep rules & priorities in state
  const [rules, setRules] = useState<any[]>([]);
  const [priorities, setPriorities] = useState({
    priorityLevel: 50,
    fairness: 25,
    cost: 15,
    speed: 10,
  });

  const handleFile = async (files: FileList, type: string) => {
    const data = await parseFile(files[0]);
    if (type === "clients") setClients(data);
    if (type === "workers") setWorkers(data);
    if (type === "tasks") setTasks(data);
  };

  const runValidation = () => {
    setErrors(validateAll(clients, workers, tasks));
  };

  const exportAll = () => {
    exportCSV(clients, "clients_clean.xlsx");
    exportCSV(workers, "workers_clean.xlsx");
    exportCSV(tasks, "tasks_clean.xlsx");

    exportJSON({ rules, priorities }, "rules.json");
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-blue-600">Data Alchemist</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FileUpload
          label="Upload Clients"
          onFile={(f) => handleFile(f, "clients")}
        />
        <FileUpload
          label="Upload Workers"
          onFile={(f) => handleFile(f, "workers")}
        />
        <FileUpload
          label="Upload Tasks"
          onFile={(f) => handleFile(f, "tasks")}
        />
      </div>

      <button
        onClick={runValidation}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Run Validation
      </button>

      {errors.length > 0 && <ValidationSummary errors={errors} />}

      {clients.length > 0 && <GridBlock title="Clients" data={clients} />}
      {workers.length > 0 && <GridBlock title="Workers" data={workers} />}
      {tasks.length > 0 && <GridBlock title="Tasks" data={tasks} />}

      <section>
        <h2 className="text-xl font-semibold mb-2">Business Rules</h2>
        <RuleBuilder
          onAdd={(rule: any) => setRules((prev) => [...prev, rule])}
        />
        {rules.length > 0 && (
          <pre className="bg-gray-50 border p-2 mt-2 rounded max-h-48 overflow-auto text-black">
            {JSON.stringify(rules, null, 2)}
          </pre>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Prioritization</h2>
        <PrioritySliders onChange={setPriorities} initial={priorities} />
        <pre className="bg-gray-50 border p-2 mt-2 rounded text-black">
          {JSON.stringify(priorities, null, 2)}
        </pre>
      </section>

      <button
        onClick={exportAll}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Export Clean Data + Rules.json
      </button>
    </div>
  );
}

function GridBlock({ title, data }: { title: string; data: any[] }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <DataGridComp
        rowData={data}
        columnDefs={Object.keys(data[0] || {}).map((f) => ({
          field: f,
          editable: true,
        }))}
      />
    </div>
  );
}
