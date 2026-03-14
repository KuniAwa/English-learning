"use client";

import { useState } from "react";
import type { SavedPhrase } from "@/types";

type Props = {
  phrase: SavedPhrase;
  onRemove: (id: string) => void;
};

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("ja-JP", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

export function ReviewCard({ phrase, onRemove }: Props) {
  const [showAnswer, setShowAnswer] = useState(false);
  const hasSituation = Boolean(phrase.partnerLine ?? phrase.partnerLineJa);

  return (
    <article className="rounded-2xl border border-border bg-white overflow-hidden">
      <div className="px-4 py-2.5 bg-slate-100 border-b border-border flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-semibold text-primary">{phrase.scenarioTitle}</span>
        <span className="text-xs text-muted">{formatDate(phrase.savedAt)}</span>
      </div>
      <div className="p-4 space-y-4">
        {hasSituation && (
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
            <p className="text-xs font-medium text-muted uppercase tracking-wide mb-1">状況</p>
            {phrase.partnerLine && (
              <p className="text-primary text-sm leading-relaxed">{phrase.partnerLine}</p>
            )}
            {phrase.partnerLineJa && (
              <p className="text-muted text-xs mt-0.5">{phrase.partnerLineJa}</p>
            )}
          </div>
        )}
        <div>
          <p className="text-xs font-medium text-muted uppercase tracking-wide">自分の文</p>
          <p className="text-primary mt-0.5 leading-relaxed">{phrase.userInput}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted uppercase tracking-wide">アドバイス</p>
          <p className="text-primary text-sm mt-0.5 leading-relaxed">{phrase.correction}</p>
        </div>

        {/* 再練習: 答えを見る前の「考えてから確認」 */}
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-3">
          <p className="text-sm font-medium text-primary">もう一度、自然な言い方を考えてみる</p>
          <p className="text-muted text-xs leading-relaxed">
            頭の中で英語を思い浮かべてから、下のボタンで答えを確認しましょう。
          </p>
          {!showAnswer ? (
            <button
              type="button"
              onClick={() => setShowAnswer(true)}
              className="w-full rounded-xl bg-accent text-white py-3 text-sm font-medium tap-target min-h-[48px]"
            >
              答え（言い換え例）を見る
            </button>
          ) : (
            <div className="pt-2 border-t border-slate-200">
              <p className="text-xs font-medium text-muted uppercase tracking-wide">自然な言い換え例</p>
              <p className="text-accent font-medium text-sm mt-1 leading-relaxed">{phrase.naturalAlternative}</p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => onRemove(phrase.id)}
          className="text-sm text-muted hover:text-red-600 py-2"
        >
          一覧から削除
        </button>
      </div>
    </article>
  );
}
