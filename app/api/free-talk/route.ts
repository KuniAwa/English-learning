import { NextResponse } from "next/server";
import { getScenarioRoleConfig } from "@/data/scenarioRoles";
import { getPartnerReply } from "@/lib/ai/freeTalkService";
import type { FreeTalkMessage } from "@/types/freeTalk";

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const scenarioId = body?.scenarioId?.trim();
    const userInput = body?.userInput?.trim();
    const history: FreeTalkMessage[] = Array.isArray(body?.history) ? body.history : [];

    if (!scenarioId || typeof scenarioId !== "string") {
      return NextResponse.json(
        { ok: false, error: "scenarioId is required" },
        { status: 400 }
      );
    }
    if (!userInput || typeof userInput !== "string") {
      return NextResponse.json(
        { ok: false, error: "userInput is required" },
        { status: 400 }
      );
    }

    const roleConfig = getScenarioRoleConfig(scenarioId);
    if (!roleConfig) {
      return NextResponse.json(
        { ok: false, error: "Unknown scenario" },
        { status: 400 }
      );
    }

    const { partnerReply, optionalHint } = await getPartnerReply(
      roleConfig,
      history,
      userInput
    );

    return NextResponse.json({
      ok: true,
      partnerReply,
      optionalHint: optionalHint ?? undefined,
    });
  } catch (err) {
    console.error("[free-talk]", err);
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
