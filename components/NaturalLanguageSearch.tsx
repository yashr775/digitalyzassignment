"use client";

import { useState } from "react";

export default function NaturalLanguageSearch({
  onSearch,
}: {
  onSearch: (query: string) => void;
}) {
  const [query, setQuery] = useState("");

  return (
    <div className="flex gap-2 items-center">
      <input
        type="text"
        placeholder='e.g. "Tasks longer than 1 phase in phase 2"'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-grow rounded border px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
      />
      <button
        onClick={() => onSearch(query)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Search
      </button>
    </div>
  );
}
