import type { SavedPhrase, SavedPhraseInput } from "@/types";

const STORAGE_KEY = "english-learning-saved-phrases";

/**
 * 保存表現の読み書きを行うストレージサービス。
 * 現在は localStorage。将来 Supabase に移行する場合は、このインターフェースを満たす実装に差し替える。
 */
export const storageService = {
  getSavedPhrases,
  savePhrase,
  removeSavedPhrase,
};

/** 保存した表現を全て取得（クライアントのみ） */
export function getSavedPhrases(): SavedPhrase[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedPhrase[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** 1件保存（クライアントのみ）。id と savedAt は自動付与。 */
export function savePhrase(phrase: SavedPhraseInput): SavedPhrase {
  const newPhrase: SavedPhrase = {
    ...phrase,
    id: crypto.randomUUID(),
    savedAt: new Date().toISOString(),
  };
  const list = getSavedPhrases();
  list.unshift(newPhrase);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return newPhrase;
}

/** 1件削除（クライアントのみ） */
export function removeSavedPhrase(id: string): void {
  const list = getSavedPhrases().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
