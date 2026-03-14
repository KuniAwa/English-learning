import type { Scenario, ScenarioCategory } from "@/types";
import scenariosData from "@/data/scenarios.json";

const scenarios = scenariosData as Scenario[];

/** 全シナリオを取得（将来APIに差し替え可能） */
export function getAllScenarios(): Scenario[] {
  return scenarios;
}

/** カテゴリ別に取得（旅行 → 雑談・イベントの順） */
export function getScenariosByCategory(): { category: ScenarioCategory; scenarios: Scenario[] }[] {
  const travel = scenarios.filter((s) => s.category === "travel");
  const social = scenarios.filter((s) => s.category === "social");
  const result: { category: ScenarioCategory; scenarios: Scenario[] }[] = [];
  if (travel.length) result.push({ category: "travel", scenarios: travel });
  if (social.length) result.push({ category: "social", scenarios: social });
  return result;
}

/** IDで1件取得 */
export function getScenarioById(id: string): Scenario | undefined {
  return scenarios.find((s) => s.id === id);
}
