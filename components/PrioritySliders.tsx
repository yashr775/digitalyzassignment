"use client";

import { useState, useEffect } from "react";

type Weights = {
  priorityLevel: number;
  fairness: number;
  cost: number;
  speed: number;
};

type Props = {
  onChange: (weights: Weights) => void;
  initial?: Weights;
};

const presets: Record<string, Weights> = {
  "Maximize Fulfillment": {
    priorityLevel: 80,
    fairness: 10,
    cost: 5,
    speed: 5,
  },
  "Fair Distribution": { priorityLevel: 40, fairness: 40, cost: 10, speed: 10 },
  "Minimize Workload": { priorityLevel: 30, fairness: 20, cost: 10, speed: 40 },
};

export default function PrioritySliders({ onChange, initial }: Props) {
  const [weights, setWeights] = useState<Weights>(
    initial || { priorityLevel: 50, fairness: 25, cost: 15, speed: 10 }
  );

  useEffect(() => {
    onChange(weights);
  }, [weights, onChange]);

  const setWeight = (field: keyof Weights, value: number) => {
    setWeights((prev) => ({ ...prev, [field]: value }));
  };

  const applyPreset = (preset: string) => {
    setWeights(presets[preset]);
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded shadow max-w-md">
      <h3 className="font-semibold text-gray-700 mb-4">Set Priorities</h3>

      {Object.entries(weights).map(([key, value]) => (
        <div key={key}>
          <label className="block font-medium mb-1 capitalize text-black">
            {key.replace(/([A-Z])/g, " $1")}
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={value}
            onChange={(e) =>
              setWeight(key as keyof Weights, Number(e.target.value))
            }
            className="w-full text-black"
          />
          <div className="text-sm text-gray-600">{value}</div>
        </div>
      ))}

      <div className="flex flex-wrap gap-2 pt-4">
        {Object.keys(presets).map((name) => (
          <button
            key={name}
            onClick={() => applyPreset(name)}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {name}
          </button>
        ))}
      </div>

      {/* Placeholder for future AI-driven prioritization */}
      <div className="border-t pt-4 text-gray-500 text-sm">
        <em>AI-based priority recommendations will appear here in future.</em>
      </div>
    </div>
  );
}
