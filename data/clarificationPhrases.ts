import type { ClarificationPhrase } from "@/types/phrase";

export const clarificationPhrases: ClarificationPhrase[] = [
  { id: "c1", text: "Could you say that again?", meaningJa: "もう一度言っていただけますか？", usageNoteJa: "聞き取れなかったとき", scenarioTags: ["restaurant", "hotel", "small-talk", "family-intro", "wedding"] },
  { id: "c2", text: "Could you speak more slowly?", meaningJa: "もう少しゆっくり話していただけますか？", scenarioTags: ["restaurant", "hotel", "small-talk", "family-intro", "wedding"] },
  { id: "c3", text: "What do you recommend?", meaningJa: "おすすめは何ですか？", usageNoteJa: "レストランでよく使う", scenarioTags: ["restaurant"] },
  { id: "c4", text: "Sorry, I didn't catch that.", meaningJa: "すみません、聞き取れませんでした。", scenarioTags: ["restaurant", "hotel", "small-talk", "family-intro", "wedding"] },
  { id: "c5", text: "Do you mean ...?", meaningJa: "〜という意味ですか？", usageNoteJa: "確認したいとき", scenarioTags: ["small-talk", "family-intro", "wedding"] },
  { id: "c6", text: "Is breakfast included?", meaningJa: "朝食は含まれていますか？", scenarioTags: ["hotel"] },
  { id: "c7", text: "Could you spell that for me?", meaningJa: "スペルを教えていただけますか？", scenarioTags: ["hotel", "restaurant"] },
];

/** シナリオ ID に合う聞き返しフレーズを返す */
export function getClarificationPhrasesForScenario(scenarioId: string): ClarificationPhrase[] {
  return clarificationPhrases.filter((p) => p.scenarioTags.includes(scenarioId));
}
