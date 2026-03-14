"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getScenarioById } from "@/lib/scenarios";
import { getScenarioRoleConfig } from "@/data/scenarioRoles";
import { savePhrase } from "@/lib/storage";
import { buildSessionSummary } from "@/lib/sessionSummary";
import { VoiceInput } from "@/components/VoiceInput";
import { AudioPlayer } from "@/components/AudioPlayer";
import { SessionSummaryView } from "@/components/SessionSummaryView";
import type { FreeTalkMessage } from "@/types/freeTalk";
import type { AIFeedback } from "@/types/feedback";

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function FreeTalkPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";
  const scenario = id ? getScenarioById(id) : undefined;
  const roleConfig = id ? getScenarioRoleConfig(id) : undefined;

  const [messages, setMessages] = useState<FreeTalkMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedCountInSession, setSavedCountInSession] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<AIFeedback | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const listEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!roleConfig) return;
    if (roleConfig.openingLine) {
      setMessages([
        {
          id: generateId(),
          role: "assistant",
          content: roleConfig.openingLine,
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  }, [roleConfig?.scenarioId]);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(async () => {
    const trimmed = userInput.trim();
    if (!trimmed || !roleConfig || !id) return;

    setError(null);
    const userMsg: FreeTalkMessage = {
      id: generateId(),
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setUserInput("");
    setLoading(true);
    setLastFeedback(null);
    setFeedbackOpen(false);

    try {
      const res = await fetch("/api/free-talk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId: id,
          history: messages.map((m) => ({ id: m.id, role: m.role, content: m.content })),
          userInput: trimmed,
        }),
      });
      const data = await res.json();

      if (data.ok && data.partnerReply) {
        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            role: "assistant",
            content: data.partnerReply,
            createdAt: new Date().toISOString(),
          },
        ]);
      } else {
        setError(data.error || "返答を取得できませんでした。");
      }
    } catch {
      setError("通信エラーです。しばらくしてから再試行してください。");
    } finally {
      setLoading(false);
    }
  }, [id, roleConfig, messages, userInput]);

  const handleSaveLastExchange = useCallback(() => {
    if (!scenario || !id) return;
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
    if (!lastUser || !lastAssistant) return;

    const correction = lastFeedback?.positive ?? lastUser.content;
    const naturalAlternative = lastFeedback?.natural ?? lastUser.content;

    savePhrase({
      scenarioId: id,
      scenarioTitle: scenario.title,
      userInput: lastUser.content,
      correction,
      naturalAlternative,
      partnerLine: lastAssistant.content,
    });
    setSavedCountInSession((s) => s + 1);
  }, [scenario, id, messages, lastFeedback]);

  const fetchFeedbackForLast = useCallback(async () => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
    if (!lastUser) return;

    setFeedbackOpen(true);
    try {
      const res = await fetch("/api/ai-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInput: lastUser.content,
          scenarioContext: {
            scenarioTitle: scenario?.title,
            partnerLine: lastAssistant?.content,
          },
        }),
      });
      const data = await res.json();
      if (data.ok && data.feedback) {
        setLastFeedback(data.feedback as AIFeedback);
      }
    } catch {
      setLastFeedback(null);
    }
  }, [messages, scenario?.title]);

  if (!scenario || !roleConfig) {
    return (
      <div className="px-4 py-8">
        <p className="text-muted">シナリオが見つかりません。</p>
        <Link href="/scenarios" className="text-accent mt-2 inline-block">場面選択へ</Link>
      </div>
    );
  }

  const sessionSummary = buildSessionSummary(id, scenario.title, savedCountInSession);
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
  const canSave = lastUser && lastAssistant;

  if (showSummary) {
    return (
      <div className="px-4 py-6 max-w-lg mx-auto pb-28">
        <h1 className="text-xl font-bold text-primary">{scenario.title}</h1>
        <p className="text-muted text-sm mt-1">AIフリートーク — 会話を終了しました</p>
        <div className="mt-6">
          <SessionSummaryView summary={sessionSummary} />
        </div>
        <div className="mt-4">
          <button
            type="button"
            onClick={() => router.push("/scenarios")}
            className="rounded-xl border border-border text-primary px-4 py-3 text-sm font-medium w-full"
          >
            別の場面を選ぶ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-lg mx-auto pb-32 flex flex-col min-h-dvh">
      <Link
        href="/scenarios"
        className="text-accent text-sm font-medium inline-block py-2 -ml-1 nav-link min-h-0"
      >
        ← 場面選択
      </Link>
      <div className="mt-2 flex items-center gap-2 flex-wrap">
        <h1 className="text-xl font-bold text-primary">{scenario.title}</h1>
        <span className="rounded-full bg-accent/15 text-accent text-xs font-medium px-2.5 py-1">
          AIフリートーク
        </span>
      </div>

      <div className="mt-4 flex-1 overflow-y-auto space-y-4 min-h-0">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                m.role === "user"
                  ? "bg-accent text-white"
                  : "bg-slate-100 text-primary border border-slate-200"
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
              {m.role === "assistant" && (
                <div className="mt-2">
                  <AudioPlayer text={m.content} rate={0.9} disabled={loading} />
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-slate-100 px-4 py-3 text-muted text-sm">
              考え中…
            </div>
          </div>
        )}
        <div ref={listEndRef} />
      </div>

      {error && (
        <div className="mt-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-2 text-sm text-amber-800">
          {error}
          <button
            type="button"
            onClick={() => setError(null)}
            className="ml-2 underline"
          >
            閉じる
          </button>
        </div>
      )}

      <div className="mt-4 space-y-3 border-t border-border pt-4">
        {canSave && (
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={fetchFeedbackForLast}
              className="rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-muted hover:bg-slate-50 tap-target min-h-[44px]"
            >
              添削を見る
            </button>
            <button
              type="button"
              onClick={handleSaveLastExchange}
              className="rounded-xl border border-accent text-accent px-4 py-2.5 text-sm font-medium hover:bg-accent/5 tap-target min-h-[44px]"
            >
              このやりとりを保存
            </button>
          </div>
        )}

        {feedbackOpen && lastFeedback && (
          <details open className="rounded-xl bg-slate-50 border border-slate-200 p-4">
            <summary className="cursor-pointer text-sm font-medium text-primary">
              アドバイス
            </summary>
            <div className="mt-3 space-y-2 text-sm">
              <p><span className="text-muted">良い点: </span>{lastFeedback.positive}</p>
              {lastFeedback.improvement && (
                <p><span className="text-muted">改善: </span>{lastFeedback.improvement}</p>
              )}
              <p><span className="text-muted">自然な言い方: </span>{lastFeedback.natural}</p>
              <p className="text-muted">{lastFeedback.explanationJa}</p>
            </div>
          </details>
        )}

        <div className="flex gap-2">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="英語で返答を入力..."
            className="flex-1 rounded-xl border border-border p-4 text-primary min-h-[88px] resize-y text-base"
            rows={2}
            disabled={loading}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <VoiceInput
              onTranscript={setUserInput}
              onClear={() => setUserInput("")}
              disabled={loading}
            />
          </div>
          <button
            type="button"
            onClick={handleSend}
            disabled={!userInput.trim() || loading}
            className="rounded-xl bg-accent text-white px-5 py-3 text-sm font-medium disabled:opacity-50 tap-target min-h-[48px]"
          >
            {loading ? "送信中…" : "送信"}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowSummary(true)}
          className="w-full rounded-xl border-2 border-border text-muted py-3 text-sm font-medium hover:bg-slate-50 tap-target min-h-[48px]"
        >
          会話を終了して振り返る
        </button>
      </div>
    </div>
  );
}
