import type { ScenarioCategory } from "@/types";

const CATEGORY_LABELS: Record<ScenarioCategory, string> = {
  travel: "旅行",
  social: "雑談・イベント",
};

export function getCategoryLabel(category?: ScenarioCategory): string {
  return category ? CATEGORY_LABELS[category] : "";
}
