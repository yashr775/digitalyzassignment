/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/ai/route.ts
import { NextResponse } from "next/server";
import { askOpenAI, naturalLanguageFilterPrompt, naturalLanguageToRulePrompt } from "../../../../lib/ai";

export async function POST(req: Request) {
  try {
    const { type, query, schema, sampleData } = await req.json();

    let prompt = "";
    let systemPrompt = "";

    if (type === "search") {
      systemPrompt = "You convert natural language filters to JavaScript filter conditions.";
      prompt = await naturalLanguageFilterPrompt(query, schema, sampleData);
    } 
    else if (type === "rule") {
      systemPrompt = "You convert natural language instructions to structured JSON rules.";
      prompt = await naturalLanguageToRulePrompt(query, schema);
    }
    else {
      return NextResponse.json({ error: "Unknown AI query type" }, { status: 400 });
    }

    const result = await askOpenAI(systemPrompt, prompt);

    return NextResponse.json({ result });
  } catch (err: any) {
    console.error("AI endpoint error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
