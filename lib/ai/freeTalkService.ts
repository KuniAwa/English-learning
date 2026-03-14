import type { ScenarioRoleConfig } from "@/types/freeTalk";
import type { FreeTalkMessage } from "@/types/freeTalk";

const BASE_SYSTEM = `You are an English conversation partner for a Japanese adult learner. Your goal is practical communication abroad, not grammar tests.

Rules:
- Reply only in English, as the conversation partner (the role given below).
- Keep replies natural and not too long (1–3 sentences usually).
- Use simple but real English. Avoid difficult vocabulary.
- Stay in the selected scenario and role. Do not abruptly change topic.
- If the user's English is broken but understandable, respond naturally and keep the conversation going.
- Do not correct the user in your reply; just respond as a real conversation partner would.
- Be encouraging and friendly.`;

function buildSystemPrompt(roleConfig: ScenarioRoleConfig): string {
  return `${BASE_SYSTEM}

Your role: ${roleConfig.roleName}
Scenario: ${roleConfig.scenarioTitle}
Goal: ${roleConfig.goal}
Tone: ${roleConfig.tone}
Difficulty: ${roleConfig.difficulty}

Reply as this person. Keep the conversation going naturally.`;
}

const MAX_HISTORY_MESSAGES = 20;

function toOpenAIMessages(
  roleConfig: ScenarioRoleConfig,
  history: FreeTalkMessage[],
  userInput: string
): { role: "system" | "user" | "assistant"; content: string }[] {
  const systemContent = buildSystemPrompt(roleConfig);
  const recent = history.slice(-MAX_HISTORY_MESSAGES);
  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: systemContent },
  ];

  if (roleConfig.openingLine && recent.length === 0) {
    messages.push({ role: "assistant", content: roleConfig.openingLine });
  }

  for (const m of recent) {
    messages.push({
      role: m.role === "user" ? "user" : "assistant",
      content: m.content,
    });
  }
  messages.push({ role: "user", content: userInput });
  return messages;
}

export interface FreeTalkResult {
  partnerReply: string;
  optionalHint?: string;
}

/**
 * 会話履歴とユーザー入力を元に、相手役の返答を生成する。
 * サーバー側（API Route）からのみ呼ぶこと。
 */
export async function getPartnerReply(
  roleConfig: ScenarioRoleConfig,
  history: FreeTalkMessage[],
  userInput: string
): Promise<FreeTalkResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  const messages = toOpenAIMessages(roleConfig, history, userInput);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 200,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${err}`);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("No content in OpenAI response");
  }

  return { partnerReply: content };
}

const CUSTOM_SYSTEM_PREFIX = `You are an English conversation partner for a Japanese adult learner. Your goal is practical communication in English.

Rules:
- Reply only in English, as the character or in the situation described below.
- Keep replies natural and not too long (1–3 sentences usually).
- Use simple but real English. Avoid difficult vocabulary.
- If the user says "[Start the conversation.]", respond with a natural opening line to begin the conversation as your character.
- If the user's English is broken but understandable, respond naturally and keep the conversation going.
- Do not correct the user in your reply; just respond as a real conversation partner would.
- Be encouraging and friendly.

The user has set up the following scenario/role for this conversation (describe in Japanese or English):
`;

function buildCustomSystemPrompt(customSetting: string): string {
  return `${CUSTOM_SYSTEM_PREFIX}

"${customSetting}"

Reply as that character or in that situation. Keep the conversation going naturally.`;
}

function toOpenAIMessagesCustom(
  customSetting: string,
  history: FreeTalkMessage[],
  userInput: string
): { role: "system" | "user" | "assistant"; content: string }[] {
  const systemContent = buildCustomSystemPrompt(customSetting);
  const recent = history.slice(-MAX_HISTORY_MESSAGES);
  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: systemContent },
  ];
  for (const m of recent) {
    messages.push({
      role: m.role === "user" ? "user" : "assistant",
      content: m.content,
    });
  }
  messages.push({ role: "user", content: userInput });
  return messages;
}

/**
 * ユーザーが入力したトーク設定に基づいて、相手役の返答を生成する。
 * ホームから「設定を入力してAIフリートーク」で使用。
 */
export async function getPartnerReplyWithCustomSetting(
  customSetting: string,
  history: FreeTalkMessage[],
  userInput: string
): Promise<FreeTalkResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  const messages = toOpenAIMessagesCustom(customSetting, history, userInput);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 200,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${err}`);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("No content in OpenAI response");
  }

  return { partnerReply: content };
}
