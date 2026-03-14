import type { SessionSummary } from "@/types/phrase";
import { getSavedPhrases } from "./storage";

/**
 * シナリオ完了時の振り返りデータを組み立てる。
 * このセッションで保存した数と、復習のおすすめ（当シナリオで保存した表現）を返す。
 */
export function buildSessionSummary(
  scenarioId: string,
  scenarioTitle: string,
  savedCountThisSession: number
): SessionSummary {
  const allSaved = getSavedPhrases();
  const forScenario = allSaved.filter((p) => p.scenarioId === scenarioId);
  const recommendedReview = forScenario
    .slice(0, 5)
    .map((p) => p.naturalAlternative)
    .filter(Boolean);

  return {
    scenarioId,
    scenarioTitle,
    completedAt: new Date().toISOString(),
    savedCount: savedCountThisSession,
    recommendedReview,
  };
}
