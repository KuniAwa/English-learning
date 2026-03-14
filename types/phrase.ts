/**
 * 聞き返し・確認で使うフレーズ（シナリオごとに表示）
 */
export interface ClarificationPhrase {
  id: string;
  text: string;
  meaningJa: string;
  usageNoteJa?: string;
  /** このフレーズを表示するシナリオの id */
  scenarioTags: string[];
}

/**
 * 1シナリオ完了時の振り返り用
 */
export interface SessionSummary {
  scenarioId: string;
  scenarioTitle: string;
  completedAt: string; // ISO
  savedCount: number;
  /** 復習のおすすめ（保存した表現の naturalAlternative など） */
  recommendedReview: string[];
}
