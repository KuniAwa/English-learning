import type { Feedback } from "@/types";
import { getScenarioById } from "./scenarios";

/**
 * フィードバック取得サービス。
 * 現在はシナリオの固定データ（sampleFeedback）を返す。
 * 将来 OpenAI API や他 LLM に差し替える場合は、この関数内で API を呼び、
 * 同じ Feedback 型を返す実装に置き換える。
 */
export function getFeedbackForTurn(
  scenarioId: string,
  turnIndex: number,
  _userInput: string
): Feedback | null {
  const scenario = getScenarioById(scenarioId);
  if (!scenario) return null;
  const turn = scenario.turns.find((t) => t.turnIndex === turnIndex);
  return turn?.sampleFeedback ?? null;
}
