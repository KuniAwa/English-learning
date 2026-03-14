"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { getScenarioById } from "@/lib/scenarios";
import { getFeedbackForTurn } from "@/lib/feedback";
import { savePhrase } from "@/lib/storage";
import { buildSessionSummary } from "@/lib/sessionSummary";
import { recordPracticeStart, recordTurnComplete, recordPhraseSaved } from "@/lib/sessionService";
import { ConversationTurn } from "@/components/ConversationTurn";
import { CompletedTurnView } from "@/components/CompletedTurnView";
import { SessionSummaryView } from "@/components/SessionSummaryView";
import type { AIFeedback } from "@/types/feedback";
import type { ClarificationPhrase } from "@/types/phrase";

type CompletedTurn = {
  turnIndex: number;
  userInput: string;
  aiFeedback: AIFeedback | null;
  fallbackFeedback: ReturnType<typeof getFeedbackForTurn>;
  fetchError: boolean;
};

export default function PracticePage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const scenario = id ? getScenarioById(id) : undefined;

  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [completedTurns, setCompletedTurns] = useState<CompletedTurn[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedCountInSession, setSavedCountInSession] = useState(0);

  useEffect(() => {
    if (scenario?.id) recordPracticeStart(scenario.id);
  }, [scenario?.id]);

  const handleSubmit = useCallback(
    async (userInput: string) => {
      if (!scenario) return;
      recordTurnComplete(scenario.id, currentTurnIndex, userInput);
      setLoading(true);
      const fallbackFeedback = getFeedbackForTurn(scenario.id, currentTurnIndex, userInput);
      const turn = scenario.turns[currentTurnIndex];

      try {
        const res = await fetch("/api/ai-feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userInput,
            scenarioContext: {
              scenarioTitle: scenario.title,
              partnerLine: turn?.partnerLine,
              partnerLineJa: turn?.partnerLineJa,
            },
          }),
        });
        const data = await res.json();

        if (data.ok && data.feedback) {
          setCompletedTurns((prev) => [
            ...prev,
            {
              turnIndex: currentTurnIndex,
              userInput,
              aiFeedback: data.feedback as AIFeedback,
              fallbackFeedback,
              fetchError: false,
            },
          ]);
        } else {
          setCompletedTurns((prev) => [
            ...prev,
            { turnIndex: currentTurnIndex, userInput, aiFeedback: null, fallbackFeedback, fetchError: true },
          ]);
        }
      } catch {
        setCompletedTurns((prev) => [
          ...prev,
          { turnIndex: currentTurnIndex, userInput, aiFeedback: null, fallbackFeedback, fetchError: true },
        ]);
      } finally {
        setLoading(false);
        if (currentTurnIndex < scenario.turns.length - 1) {
          setCurrentTurnIndex((i) => i + 1);
        }
      }
    },
    [currentTurnIndex, scenario]
  );

  const handleSave = useCallback(
    (
      userInput: string,
      correction: string,
      naturalAlternative: string,
      partnerLine: string,
      partnerLineJa: string
    ) => {
      if (!scenario) return;
      const saved = savePhrase({
        scenarioId: scenario.id,
        scenarioTitle: scenario.title,
        userInput,
        correction,
        naturalAlternative,
        partnerLine,
        partnerLineJa,
      });
      recordPhraseSaved(scenario.id, saved.id);
      setSavedCountInSession((s) => s + 1);
    },
    [scenario]
  );

  const handleSaveClarificationPhrase = useCallback(
    (phrase: ClarificationPhrase) => {
      if (!scenario) return;
      savePhrase({
        scenarioId: scenario.id,
        scenarioTitle: scenario.title,
        userInput: phrase.text,
        correction: phrase.meaningJa,
        naturalAlternative: phrase.text,
      });
      setSavedCountInSession((s) => s + 1);
    },
    [scenario]
  );

  if (!scenario) {
    return (
      <div className="px-4 py-8">
        <p className="text-muted">シナリオが見つかりません。</p>
        <Link href="/scenarios" className="text-accent mt-2 inline-block">場面選択へ</Link>
      </div>
    );
  }

  const totalTurns = scenario.turns.length;
  const turn = scenario.turns[currentTurnIndex];
  const allDone = completedTurns.length >= totalTurns;
  const sessionSummary = allDone
    ? buildSessionSummary(scenario.id, scenario.title, savedCountInSession)
    : null;

  return (
    <div className="px-4 py-6 max-w-lg mx-auto pb-28">
      <Link
        href="/scenarios"
        className="text-accent text-sm font-medium inline-block py-2 -ml-1 nav-link min-h-0"
      >
        ← 場面選択
      </Link>
      <h1 className="text-xl font-bold text-primary mt-2">{scenario.title}</h1>
      <div className="mt-3 flex items-center gap-3">
        <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-accent transition-all duration-300"
            style={{ width: `${totalTurns ? (completedTurns.length / totalTurns) * 100 : 0}%` }}
          />
        </div>
        <span className="text-sm font-medium text-muted tabular-nums">
          {completedTurns.length} / {totalTurns}
        </span>
      </div>

      <div className="mt-6 space-y-6">
        {completedTurns.map((ct) => {
          const t = scenario.turns.find((x) => x.turnIndex === ct.turnIndex);
          if (!t) return null;
          return (
            <CompletedTurnView
              key={ct.turnIndex}
              turnLabel={`${ct.turnIndex + 1} / ${totalTurns}`}
              partnerLine={t.partnerLine}
              partnerLineJa={t.partnerLineJa}
              userInput={ct.userInput}
              aiFeedback={ct.aiFeedback}
              fallbackFeedback={ct.fallbackFeedback}
              fetchError={ct.fetchError}
              onSave={handleSave}
            />
          );
        })}
        {!allDone && turn && (
          <ConversationTurn
            turnIndex={turn.turnIndex}
            turnLabel={`${currentTurnIndex + 1} / ${totalTurns}`}
            partnerLine={turn.partnerLine}
            partnerLineJa={turn.partnerLineJa}
            hint={turn.hint}
            scenarioId={scenario.id}
            scenarioTitle={scenario.title}
            onSubmit={handleSubmit}
            onSaveClarificationPhrase={handleSaveClarificationPhrase}
            disabled={loading}
          />
        )}
        {allDone && sessionSummary && (
          <SessionSummaryView summary={sessionSummary} />
        )}
      </div>
    </div>
  );
}
