"use client";

import { useCallback, useEffect, useState } from "react";
import { isAudioPlaybackSupported, playText, stopPlayback } from "@/lib/audioPlayback";

type Props = {
  text: string;
  /** 読み上げ速度（0.8〜1.0 でゆっくりめ） */
  rate?: number;
  disabled?: boolean;
};

export function AudioPlayer({ text, rate = 0.9, disabled = false }: Props) {
  const [playing, setPlaying] = useState(false);
  const [supported, setSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSupported(isAudioPlaybackSupported());
  }, []);

  useEffect(() => {
    return () => {
      stopPlayback();
    };
  }, []);

  const handlePlay = useCallback(async () => {
    if (!supported || !text.trim() || disabled) return;
    setError(null);
    setPlaying(true);
    try {
      await playText(text, { rate });
    } catch (e) {
      setError("音声を再生できませんでした");
    } finally {
      setPlaying(false);
    }
  }, [text, rate, supported, disabled]);

  const handleStop = useCallback(() => {
    stopPlayback();
    setPlaying(false);
  }, []);

  if (!supported) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        type="button"
        onClick={playing ? handleStop : handlePlay}
        disabled={disabled || !text.trim()}
        className={`rounded-xl px-4 py-2.5 text-sm font-medium tap-target min-h-[44px] flex items-center gap-2 ${
          playing
            ? "bg-amber-100 text-amber-800"
            : "bg-slate-100 text-primary hover:bg-slate-200"
        } disabled:opacity-50`}
        aria-label={playing ? "再生を停止" : "相手のセリフを読み上げる"}
        aria-pressed={playing}
      >
        <span aria-hidden>{playing ? "⏹" : "🔊"}</span>
        {playing ? "停止" : "再生"}
      </button>
      {playing && (
        <span className="text-sm text-muted flex items-center gap-1.5" role="status">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          再生中
        </span>
      )}
      {error && (
        <span className="text-sm text-amber-700" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
