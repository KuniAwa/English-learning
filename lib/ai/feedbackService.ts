import type { AIFeedback, ScenarioContext } from "@/types/feedback";

const SYSTEM_PROMPT = `You are an English coach helping Japanese adult learners speak natural English abroad.

Rules:
- Be encouraging. If the message is understandable, say so clearly (e.g. "Your message is understandable.").
- Do not overcorrect. Focus on what helps natural communication.
- Keep explanations short.
- Return ONLY valid JSON with these exact keys: positive, improvement, natural, short, polite, explanationJa.
- Write improvement in one short paragraph (max 2 points). Use "None" or "—" only if there is nothing to improve.
- All values must be strings. explanationJa must be in Japanese.`;

function buildUserPrompt(userInput: string, context: ScenarioContext): string {
  const parts = [
    `User's English: "${userInput}"`,
  ];
  if (context.scenarioTitle) parts.push(`Scenario: ${context.scenarioTitle}`);
  if (context.partnerLine) parts.push(`Partner said: ${context.partnerLine}`);
  if (context.partnerLineJa) parts.push(`(Japanese: ${context.partnerLineJa})`);
  parts.push("\nReturn JSON: { \"positive\": \"...\", \"improvement\": \"...\", \"natural\": \"...\", \"short\": \"...\", \"polite\": \"...\", \"explanationJa\": \"...\" }");
  return parts.join("\n");
}

/**
 * OpenAI API を呼び出し、構造化フィードバックを取得する。
 * 環境変数 OPENAI_API_KEY を使用。サーバー側（API Route）からのみ呼ぶこと。
 */
export async function getAIFeedback(
  userInput: string,
  scenarioContext: ScenarioContext
): Promise<AIFeedback> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(userInput, scenarioContext) },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${err}`);
  }

  const data = (await response.json()) as { choices?: { message?: { content?: string } }[] };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("No content in OpenAI response");

  const parsed = JSON.parse(content) as Record<string, string>;
  return {
    positive: String(parsed.positive ?? ""),
    improvement: String(parsed.improvement ?? ""),
    natural: String(parsed.natural ?? ""),
    short: String(parsed.short ?? ""),
    polite: String(parsed.polite ?? ""),
    explanationJa: String(parsed.explanationJa ?? ""),
  };
}
