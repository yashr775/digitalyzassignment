/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/ai.ts
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // set in .env.local
});

export async function naturalLanguageFilterPrompt(query: string, schema: string, sampleData: any[]) {
  return `
You are a data query assistant.  
The dataset schema is: ${schema}

Example rows: ${JSON.stringify(sampleData.slice(0, 3), null, 2)}

The user query is: "${query}"

Return ONLY a valid JavaScript filter function body that can be used on an array of rows.
For example:
(row) => row.Duration > 1 && row.PreferredPhases.includes(2)
`;
}

export async function naturalLanguageToRulePrompt(query: string, schema: string) {
  return `
You are a rules generator.  
Given the dataset schema: ${schema}  
Convert the following user request into a JSON rule object:

User: "${query}"

Example rule format:
{ "type": "coRun", "tasks": ["T1","T2"], "phaseWindow": [2,3,4] }

Only return valid JSON.
`;
}

export async function askOpenAI(systemPrompt: string, userPrompt: string) {
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0,
  });
  return res.choices[0].message?.content ?? "";
}
