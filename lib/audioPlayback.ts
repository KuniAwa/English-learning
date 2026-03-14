/**
 * 相手役の英語を音声で読み上げるサービス。
 * 現在はブラウザの SpeechSynthesis API を使用。将来 OpenAI TTS 等に差し替え可能。
 */

const DEFAULT_RATE = 0.9; // 少しゆっくりめ

export function isAudioPlaybackSupported(): boolean {
  if (typeof window === "undefined") return false;
  return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

export interface PlayOptions {
  /** 読み上げ速度（0.1〜10、1が標準。ゆっくりは 0.8〜0.95） */
  rate?: number;
  /** 言語（デフォルト en-US） */
  lang?: string;
}

/**
 * テキストを音声で再生する。再生中は Promise は resolve しない（キャンセル時は reject）。
 * クライアントのみで実行すること。
 */
export function playText(
  text: string,
  options: PlayOptions = {}
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!isAudioPlaybackSupported()) {
      reject(new Error("音声再生はお使いの環境では利用できません"));
      return;
    }
    const trimmed = text.trim();
    if (!trimmed) {
      resolve();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(trimmed);
    utterance.rate = options.rate ?? DEFAULT_RATE;
    utterance.lang = options.lang ?? "en-US";

    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  });
}

/** 再生を停止する */
export function stopPlayback(): void {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
