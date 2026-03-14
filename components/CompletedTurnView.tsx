"use client";

import { AIFeedbackDisplay } from "./AIFeedbackDisplay";
import { FeedbackDisplay } from "./FeedbackDisplay";
import { AudioPlayer } from "./AudioPlayer";
import type { AIFeedback } from "@/types/feedback";
import type { Feedback } from "@/types";

type Props = {
  turnLabel: string;
  partnerLine: string;
  partnerLineJa: string;
  userInput: string;
  /** AI フィードバック（取得成功時） */
  aiFeedback: AIFeedback | null;
  /** 固定フィードバック（AI エラー時のフォールバック） */
  fallbackFeedback: Feedback | null;
  /** AI 取得に失敗した場合 true */
  fetchError?: boolean;
  /** 保存時に渡すテキスト（correction, naturalAlternative） */
  onSave?: (
    userInput: string,
    correction: string,
    naturalAlternative: string,
    partnerLine: string,
    partnerLineJa: string
  ) => void;
};

export function CompletedTurnView({
  turnLabel,
  partnerLine,
  partnerLineJa,
  userInput,
  aiFeedback,
  fallbackFeedback,
  fetchError = false,
  onSave,
}: Props) {
  const correction = aiFeedback
    ? `${aiFeedback.positive}${aiFeedback.improvement ? "\n" + aiFeedback.improvement : ""}`
    : fallbackFeedback?.correction ?? "";
  const naturalAlternative = aiFeedback?.natural ?? fallbackFeedback?.naturalAlternative ?? "";

  return (
    <section className="rounded-2xl border border-border bg-white overflow-hidden" aria-label={`${turnLabel}のやりとり（完了）`}>
      <div className="bg-slate-100 px-4 py-2 border-b border-border">
        <span className="text-sm font-medium text-muted">{turnLabel}</span>
      </div>
      <div className="p-4 space-y-4">
        {/* 相手の発話 + 再生 */}
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-3">
          <p className="text-primary font-medium leading-relaxed">{partnerLine}</p>
          <p className="text-muted text-sm">{partnerLineJa}</p>
          <AudioPlayer text={partnerLine} rate={0.9} />
        </div>
        <div>
          <p className="text-xs font-medium text-muted uppercase tracking-wide">あなたの返答</p>
          <p className="text-primary mt-0.5 leading-relaxed">{userInput}</p>
        </div>
        {fetchError && (
          <p className="text-muted text-sm">
            {fallbackFeedback
              ? "AIによる添削は利用できませんでした。参考として以下のアドバイスを表示しています。"
              : "フィードバックを取得できませんでした。"}
          </p>
        )}
        {aiFeedback && !fetchError && <AIFeedbackDisplay feedback={aiFeedback} />}
        {fallbackFeedback && (fetchError || !aiFeedback) && (
          <FeedbackDisplay feedback={fallbackFeedback} />
        )}
        {onSave && (correction || naturalAlternative) && (
          <button
            type="button"
            onClick={() => onSave(userInput, correction, naturalAlternative, partnerLine, partnerLineJa)}
            className="w-full rounded-xl border-2 border-accent text-accent py-3 text-sm font-medium hover:bg-accent/5 tap-target min-h-[48px]"
          >
            この表現を保存する
          </button>
        )}
      </div>
    </section>
  );
}
