/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import RuleBuilder from "../../../components/RuleBuilder";

export default function RulesPage() {
  const [rules, setRules] = useState<any[]>([]);

  const addRule = (rule: any) => {
    setRules((prev) => [...prev, rule]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-blue-600">Rule Builder</h1>

      <RuleBuilder onAdd={addRule} />

      <div>
        <h2 className="font-semibold text-lg mb-2">Current Rules</h2>
        <pre className="bg-gray-100 p-4 rounded max-h-80 overflow-auto whitespace-pre-wrap">
          {JSON.stringify(rules, null, 2)}
        </pre>
      </div>
    </div>
  );
}
