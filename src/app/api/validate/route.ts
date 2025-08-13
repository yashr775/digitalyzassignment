// app/api/validate/route.ts
import { NextResponse } from "next/server";
import type { ValidationError } from "../../../../lib/validators";
import { validateAll } from "../../../../lib/validators";

export async function POST(request: Request) {
  try {
    // Parse incoming JSON body (array of clients, workers, tasks)
    const { clients, workers, tasks } = await request.json();

    // Basic sanity check for required keys
    if (!clients || !workers || !tasks) {
      return NextResponse.json(
        { error: "Missing one or more required entities: clients, workers, tasks" },
        { status: 400 }
      );
    }

    // Run validation logic (returns array of ValidationError)
    const errors: ValidationError[] = validateAll(clients, workers, tasks);

    // Return validation results
    return NextResponse.json({ errors });
  } catch (error: unknown) {
    // Error fallback: log and respond with error message
    console.error("Validation API error:", error);

    let message = "Unknown error";
    if (error instanceof Error) message = error.message;

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// Optional: restrict other methods if desired (not needed for explicit POST export)
