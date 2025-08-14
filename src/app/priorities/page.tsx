"use client";

import { useState } from "react";
import PrioritySliders from "../../../components/PrioritySliders";

export default function PrioritiesPage() {
  const [weights, setWeights] = useState({
    priorityLevel: 50,
    fairness: 25,
    cost: 15,
    speed: 10,
  });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-blue-600">Set Priorities</h1>

      <PrioritySliders onChange={setWeights} initial={weights} />

      <div>
        <h2 className="font-semibold text-lg mb-2 text-black">
          Current Priority Weights
        </h2>
        <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
          {JSON.stringify(weights, null, 2)}
        </pre>
      </div>
    </div>
  );
}
