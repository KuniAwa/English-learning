/** 場面のカテゴリ（場面選択での見分け用） */
export type ScenarioCategory = "travel" | "social";

/** シナリオ（場面） */
export interface Scenario {
  id: string;
  title: string;
  titleJa: string;
  description: string;
  /** 旅行系 / 雑談・イベント系の区別用（表示のみ） */
  category?: ScenarioCategory;
  turns: ConversationTurn[];
}

/** 会話の1ターン（相手の発話 + 期待されるユーザー応答のヒント等） */
export interface ConversationTurn {
  turnIndex: number;
  partnerLine: string;
  partnerLineJa: string;
  /** ヒント（ユーザーが「ヒントを見る」で表示） */
  hint: string;
  /** 固定データ用：期待される入力に近い場合の添削・言い換え（将来はAIで生成） */
  sampleFeedback: Feedback;
}

/** 表現のトーン（丁寧/カジュアルの補足用） */
export type FeedbackTone = "formal" | "casual" | "neutral";

/** 1ターン分の添削・言い換え・解説 */
export interface Feedback {
  /** やさしい添削（文法・自然さの指摘） */
  correction: string;
  /** より自然な言い換え例 */
  naturalAlternative: string;
  /** 日本語の短い解説 */
  explanationJa: string;
  /** 丁寧/カジュアルなどの補足（表示用） */
  tone?: FeedbackTone;
}

/** 保存時の入力（id, savedAt は storage が付与） */
export interface SavedPhraseInput {
  scenarioId: string;
  scenarioTitle: string;
  userInput: string;
  correction: string;
  naturalAlternative: string;
  /** 復習時の状況説明用（任意） */
  partnerLine?: string;
  partnerLineJa?: string;
}

/** 復習用に保存した表現（メタ情報含む・Supabase 移行時も同じ形を想定） */
export interface SavedPhrase extends SavedPhraseInput {
  id: string;
  savedAt: string; // ISO string
}
