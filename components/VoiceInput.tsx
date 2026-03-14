"use client";

import { useCallback, useEffect, useRef, useState } from "react";

function getSpeechRecognition(): typeof SpeechRecognition | null {
  if (typeof window === "undefined") return null;
  const w = window as Window;
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

type Props = {
  /** 認識したテキストを親に渡す */
  onTranscript: (text: string) => void;
  /** 再録音でテキストをクリアするときに呼ぶ */
  onClear: () => void;
  /** 音声入力が使えない場合に true を渡すとマイクUIを出さない */
  disabled?: boolean;
};

export function VoiceInput({ onTranscript, onClear, disabled = false }: Props) {
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const recognitionRef = useRef<InstanceType<typeof SpeechRecognition> | null>(null);

  useEffect(() => {
    setIsSupported(!!getSpeechRecognition());
  }, []);

  const stopRecording = useCallback(() => {
    const rec = recognitionRef.current;
    if (rec) {
      try {
        rec.stop();
      } catch {
        // already stopped
      }
      recognitionRef.current = null;
    }
    setRecording(false);
  }, []);

  const startRecording = useCallback(() => {
    setError(null);
    onClear(); // 新しい録音開始でいったんクリア
    const Klass = getSpeechRecognition();
    if (!Klass) {
      setError("音声入力はお使いのブラウザでは利用できません");
      return;
    }

    const recognition = new Klass();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let finalTranscript = "";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0]?.transcript ?? "";
        if (result.isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interim += transcript;
        }
      }
      const text = (finalTranscript + interim).trim();
      if (text) onTranscript(text);
    };

    recognition.onend = () => {
      recognitionRef.current = null;
      setRecording(false);
    };

    recognition.onerror = (event: Event) => {
      const e = event as Event & { error?: string };
      recognitionRef.current = null;
      setRecording(false);
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        setError("マイクの使用が許可されていません。ブラウザの設定を確認してください。");
      } else {
        setError("音声を認識できませんでした");
      }
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
      setRecording(true);
    } catch (err) {
      setError("音声を認識できませんでした");
      setRecording(false);
    }
  }, [onTranscript, onClear]);

  const handleToggle = useCallback(() => {
    if (recording) stopRecording();
    else startRecording();
  }, [recording, startRecording, stopRecording]);

  const handleReRecord = useCallback(() => {
    stopRecording();
    onClear();
    setError(null);
  }, [stopRecording, onClear]);

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, [stopRecording]);

  if (isSupported === false || disabled) {
    return null;
  }

  if (isSupported === null) {
    return null; // still detecting
  }

  return (
    <div className="space-y-2" role="group" aria-label="音声入力">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          className={`rounded-xl px-4 py-3 text-sm font-medium tap-target min-h-[48px] flex items-center gap-2 ${
            recording
              ? "bg-red-100 text-red-700 hover:bg-red-200"
              : "bg-slate-100 text-primary hover:bg-slate-200"
          }`}
          aria-pressed={recording}
          aria-label={recording ? "録音を停止" : "音声で入力（マイク）"}
        >
          <span className="text-lg" aria-hidden>
            {recording ? "⏹" : "🎤"}
          </span>
          {recording ? "Stop" : "Speak"}
        </button>
        {recording && (
          <span
            className="flex items-center gap-1.5 text-sm text-red-600"
            role="status"
            aria-live="polite"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            録音中
          </span>
        )}
        {(recording || error) && (
          <button
            type="button"
            onClick={handleReRecord}
            className="rounded-xl border border-border bg-white px-4 py-3 text-sm text-muted hover:bg-slate-50 tap-target min-h-[48px]"
          >
            再録音
          </button>
        )}
      </div>
      {error && (
        <p className="text-amber-700 text-sm" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
