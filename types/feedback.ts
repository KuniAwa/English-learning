/**
 * AI が返す添削・学習フィードバックの型。
 * 実用的で優しいフィードバックを想定（文法試験のような厳しい添削ではない）。
 */
export interface AIFeedback {
  /** 良い点（そのままでも通じる場合はそれを伝える） */
  positive: string;
  /** 改善ポイント（最大2個。複数は改行や箇条書きで） */
  improvement: string;
  /** より自然な表現 */
  natural: string;
  /** より短く言う言い方 */
  short: string;
  /** 丁寧な言い方 */
  polite: string;
  /** 日本語での短い解説 */
  explanationJa: string;
}

/** API に渡すシナリオの文脈 */
export interface ScenarioContext {
  scenarioTitle?: string;
  partnerLine?: string;
  partnerLineJa?: string;
}
