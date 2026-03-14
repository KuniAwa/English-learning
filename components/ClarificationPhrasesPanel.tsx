"use client";

import { useState } from "react";
import { getClarificationPhrasesForScenario } from "@/data/clarificationPhrases";
import { AudioPlayer } from "./AudioPlayer";
import type { ClarificationPhrase } from "@/types/phrase";

type Props = {
  scenarioId: string;
  scenarioTitle: string;
  onSavePhrase: (phrase: ClarificationPhrase) => void;
};

export function ClarificationPhrasesPanel({
  scenarioId,
  scenarioTitle,
  onSavePhrase,
}: Props) {
  const [open, setOpen] = useState(false);
  const phrases = getClarificationPhrasesForScenario(scenarioId);

  if (phrases.length === 0) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full px-4 py-3 text-left text-sm font-medium text-primary hover:bg-slate-100 flex items-center justify-between tap-target min-h-[48px]"
        aria-expanded={open}
      >
        <span>聞き返しフレーズを見る</span>
        <span className="text-muted">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-slate-200 pt-3">
          <p className="text-xs text-muted">
            聞き取れないときや確認したいときに使える表現です。覚えておくと安心です。
          </p>
          <ul className="space-y-3">
            {phrases.map((p) => (
              <li
                key={p.id}
                className="rounded-lg border border-slate-200 bg-white p-3 space-y-2"
              >
                <p className="font-medium text-primary">{p.text}</p>
                <p className="text-sm text-muted">{p.meaningJa}</p>
                {p.usageNoteJa && (
                  <p className="text-xs text-muted">{p.usageNoteJa}</p>
                )}
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <AudioPlayer text={p.text} rate={0.85} />
                  <button
                    type="button"
                    onClick={() => onSavePhrase(p)}
                    className="rounded-lg border border-accent text-accent px-3 py-2 text-sm font-medium hover:bg-accent/5 tap-target min-h-[44px]"
                  >
                    保存する
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
