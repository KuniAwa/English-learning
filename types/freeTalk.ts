/** フリートーク会話の1メッセージ */
export interface FreeTalkMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
}

/** シーンごとのAI相手役設定 */
export interface ScenarioRoleConfig {
  scenarioId: string;
  scenarioTitle: string;
  roleName: string;
  goal: string;
  tone: string;
  difficulty: "easy" | "medium";
  /** 会話開始時の相手の一言（省略時はAPIで生成） */
  openingLine?: string;
}

/** /api/free-talk のレスポンス */
export interface FreeTalkResponse {
  partnerReply: string;
  optionalHint?: string;
}
