import { ValidationError } from "../lib/validators";

export default function ValidationSummary({
  errors,
}: {
  errors: ValidationError[];
}) {
  if (errors.length === 0) {
    return (
      <div className="bg-green-50 border border-green-300 rounded p-3 text-green-700">
        ✅ No validation errors
      </div>
    );
  }

  return (
    <div className="bg-red-50 border border-red-300 rounded p-3">
      <h3 className="font-semibold text-red-600 mb-2">Validation Errors</h3>
      <ul className="list-disc list-inside text-sm text-red-700 max-h-40 overflow-y-auto">
        {errors.map((e, i) => (
          <li key={i}>
            [{e.entity}] {e.row >= 0 ? `Row ${e.row + 1}, ` : ""}
            {e.column}: {e.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
