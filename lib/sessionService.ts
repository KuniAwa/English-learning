/**
 * 練習セッション・学習履歴の記録用サービス（スタブ）。
 * 将来の学習履歴分析や Supabase 連携時に、ここで record 系を実装する。
 * 現時点では呼び出しても何もしない。
 */

export const sessionService = {
  recordPracticeStart,
  recordTurnComplete,
  recordPhraseSaved,
};

/** 練習開始時（シナリオ選択後） */
export function recordPracticeStart(_scenarioId: string): void {
  // TODO: 履歴テーブルに記録、または analytics 送信
}

/** 1ターン完了時 */
export function recordTurnComplete(
  _scenarioId: string,
  _turnIndex: number,
  _userInput: string
): void {
  // TODO: 将来の AI 学習や分析用
}

/** 表現を保存した時 */
export function recordPhraseSaved(
  _scenarioId: string,
  _phraseId: string
): void {
  // TODO: 復習頻度の分析など
}
