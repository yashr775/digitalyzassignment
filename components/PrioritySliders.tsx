/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

export default function PrioritySliders({
  onChange,
}: {
  onChange: (weights: any) => void;
}) {
  const [priorityWeight, setPriorityWeight] = useState(50);
  const [fairnessWeight, setFairnessWeight] = useState(50);

  const update = (setter: (n: number) => void, value: number) => {
    setter(value);
    onChange({
      priorityWeight,
      fairnessWeight,
      [setter === setPriorityWeight ? "priorityWeight" : "fairnessWeight"]:
        value,
    });
  };

  return (
    <div className="space-y-4 bg-white p-4 rounded shadow">
      <div>
        <label className="block font-medium">
          Priority Level Weight: {priorityWeight}
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={priorityWeight}
          onChange={(e) => update(setPriorityWeight, Number(e.target.value))}
          className="w-full"
        />
      </div>
      <div>
        <label className="block font-medium">
          Fairness Weight: {fairnessWeight}
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={fairnessWeight}
          onChange={(e) => update(setFairnessWeight, Number(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
}
