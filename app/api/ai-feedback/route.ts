import { NextResponse } from "next/server";
import { getAIFeedback } from "@/lib/ai/feedbackService";
import type { ScenarioContext } from "@/types/feedback";

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userInput = body?.userInput?.trim();
    const scenarioContext: ScenarioContext = body?.scenarioContext ?? {};

    if (!userInput || typeof userInput !== "string") {
      return NextResponse.json(
        { ok: false, error: "userInput is required" },
        { status: 400 }
      );
    }

    const feedback = await getAIFeedback(userInput, scenarioContext);
    return NextResponse.json({ ok: true, feedback });
  } catch (err) {
    console.error("[ai-feedback]", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
