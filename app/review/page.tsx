"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSavedPhrases, removeSavedPhrase } from "@/lib/storage";
import { ReviewCard } from "@/components/ReviewCard";
import type { SavedPhrase } from "@/types";

export default function ReviewPage() {
  const [phrases, setPhrases] = useState<SavedPhrase[]>([]);

  useEffect(() => {
    setPhrases(getSavedPhrases());
  }, []);

  const handleRemove = (id: string) => {
    removeSavedPhrase(id);
    setPhrases(getSavedPhrases());
  };

  return (
    <div className="px-4 py-6 max-w-lg mx-auto pb-28">
      <Link
        href="/"
        className="text-accent text-sm font-medium inline-block py-2 -ml-1 nav-link min-h-0"
      >
        ← ホーム
      </Link>
      <h1 className="text-xl font-bold text-primary mt-2">復習</h1>
      <p className="text-muted text-sm mt-1">
        保存した表現をいつでも確認できます。状況を見てからもう一度言い方を考えてみると、定着しやすくなります。
      </p>

      {phrases.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-border bg-white p-8 text-center">
          <p className="text-primary font-medium">まだ保存した表現はありません</p>
          <p className="text-muted text-sm mt-2 leading-relaxed">
            練習画面で「この表現を保存する」から、覚えておきたいフレーズを追加できます。無理なく、気になったものから保存してみてください。
          </p>
          <Link
            href="/scenarios"
            className="inline-block mt-6 rounded-xl bg-accent text-white font-medium px-6 py-3 nav-link"
          >
            場面を選んで練習する
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {phrases.map((p) => (
            <li key={p.id}>
              <ReviewCard phrase={p} onRemove={handleRemove} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
