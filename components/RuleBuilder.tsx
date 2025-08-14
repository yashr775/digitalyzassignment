/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

export default function RuleBuilder({ onAdd }: { onAdd: (rule: any) => void }) {
  const [type, setType] = useState("coRun");
  const [tasks, setTasks] = useState("");

  const handleAddManual = () => {
    if (!tasks.trim()) return;
    const rule = { type, tasks: tasks.split(",").map((t) => t.trim()) };
    onAdd(rule);
    setTasks("");
  };

  return (
    <div className="border rounded p-4 space-y-4 bg-white shadow">
      <h3 className="font-semibold text-gray-700">Add a Rule</h3>

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="border rounded px-2 py-1 text-black"
      >
        <option value="coRun">Co-run</option>
        <option value="slotRestriction">Slot Restriction</option>
        <option value="phaseWindow">Phase Window</option>
      </select>

      <input
        type="text"
        placeholder="Task IDs (comma separated)"
        value={tasks}
        onChange={(e) => setTasks(e.target.value)}
        className="border rounded px-2 py-1 w-full text-black"
      />

      <button
        onClick={handleAddManual}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Add Rule
      </button>
    </div>
  );
}
