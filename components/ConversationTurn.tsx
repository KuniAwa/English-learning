"use client";

import { useRef, useState } from "react";
import { VoiceInput, type VoiceInputHandle } from "./VoiceInput";
import { AudioPlayer } from "./AudioPlayer";
import { ClarificationPhrasesPanel } from "./ClarificationPhrasesPanel";
import { TEXT_INPUT_ENABLED } from "@/lib/featureFlags";
import type { ClarificationPhrase } from "@/types/phrase";

type Props = {
  turnIndex: number;
  turnLabel: string;
  partnerLine: string;
  partnerLineJa: string;
  hint: string;
  scenarioId: string;
  scenarioTitle: string;
  onSubmit: (userInput: string) => void;
  onSaveClarificationPhrase?: (phrase: ClarificationPhrase) => void;
  disabled?: boolean;
};

export function ConversationTurn({
  turnIndex,
  turnLabel,
  partnerLine,
  partnerLineJa,
  hint,
  scenarioId,
  scenarioTitle,
  onSubmit,
  onSaveClarificationPhrase,
  disabled = false,
}: Props) {
  const [userInput, setUserInput] = useState("");
  const [showHint, setShowHint] = useState(false);
  const voiceInputRef = useRef<VoiceInputHandle>(null);

  const handleSubmit = () => {
    const trimmed = userInput.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    voiceInputRef.current?.stopRecording();
  };

  return (
    <section className="rounded-2xl border border-border bg-white overflow-hidden" aria-label={`${turnLabel}のやりとり`}>
      <div className="bg-slate-100 px-4 py-2 border-b border-border">
        <span className="text-sm font-medium text-muted">{turnLabel}</span>
      </div>
      <div className="p-4 space-y-4">
        {/* 1. 相手の発話 */}
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-3">
          <p className="text-primary font-medium leading-relaxed">{partnerLine}</p>
          <p className="text-muted text-sm">{partnerLineJa}</p>
          {/* 2. 再生ボタン */}
          <AudioPlayer text={partnerLine} rate={0.9} disabled={disabled} />
        </div>

        {/* 3. 聞き返しフレーズ導線 */}
        {onSaveClarificationPhrase && (
          <ClarificationPhrasesPanel
            scenarioId={scenarioId}
            scenarioTitle={scenarioTitle}
            onSavePhrase={onSaveClarificationPhrase}
          />
        )}

        {/* 4. ユーザーの音声入力 / 手入力 */}
        <div>
          <label htmlFor={TEXT_INPUT_ENABLED ? `input-${turnIndex}` : undefined} className="text-sm font-medium text-primary block mb-2">
            {TEXT_INPUT_ENABLED ? "あなたの返答（英語で入力）" : "あなたの返答（音声で入力）"}
          </label>
          {TEXT_INPUT_ENABLED && (
            <textarea
              id={`input-${turnIndex}`}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your response..."
              className="w-full rounded-xl border border-border p-4 text-primary min-h-[100px] resize-y text-base"
              rows={3}
            />
          )}
          {!TEXT_INPUT_ENABLED && userInput && (
            <p className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-primary text-sm mb-3" aria-live="polite">
              {userInput}
            </p>
          )}
          <div className={TEXT_INPUT_ENABLED ? "mt-3" : ""}>
            {TEXT_INPUT_ENABLED && <p className="text-xs font-medium text-muted mb-1.5">音声で入力</p>}
            <VoiceInput
              ref={voiceInputRef}
              onTranscript={setUserInput}
              onClear={() => setUserInput("")}
              disabled={disabled}
            />
          </div>
        </div>

        {/* 5. ヒント / 6. 次へ */}
        <div className="flex flex-wrap gap-3 pt-1">
          <button
            type="button"
            onClick={() => setShowHint((h) => !h)}
            className="rounded-xl border border-border bg-white px-4 py-3 text-sm text-muted hover:bg-slate-50 tap-target min-h-[48px]"
          >
            {showHint ? "ヒントを隠す" : "ヒントを見る"}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!userInput.trim() || disabled}
            className="rounded-xl bg-accent text-white px-5 py-3 text-sm font-medium disabled:opacity-50 tap-target min-h-[48px]"
          >
            {disabled ? "送信中…" : "次へ"}
          </button>
        </div>
        {showHint && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
            <p className="text-xs font-medium text-amber-800 uppercase tracking-wide mb-1">よく使う表現の例</p>
            <p className="text-sm text-muted leading-relaxed">{hint}</p>
          </div>
        )}
      </div>
    </section>
  );
}
