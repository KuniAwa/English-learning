import Link from "next/link";
import type { SessionSummary } from "@/types/phrase";

type Props = { summary: SessionSummary };

export function SessionSummaryView({ summary }: Props) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 space-y-5">
      <div className="text-center">
        <p className="font-medium text-primary text-lg">このシナリオは一通り完了しました</p>
        <p className="text-muted text-sm mt-1">おつかれさまでした。少しずつ慣れていきましょう。</p>
      </div>

      <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-3">
        <p className="text-sm font-medium text-primary">今回の振り返り</p>
        <ul className="text-sm text-muted space-y-1">
          <li>保存した表現: {summary.savedCount} 件</li>
          {summary.recommendedReview.length > 0 && (
            <li className="pt-2">
              <span className="font-medium text-primary block mb-1">おすすめ復習</span>
              <ul className="list-disc list-inside space-y-0.5">
                {summary.recommendedReview.slice(0, 3).map((text, i) => (
                  <li key={i}>{text}</li>
                ))}
              </ul>
            </li>
          )}
        </ul>
      </div>

      <div className="flex flex-col gap-3">
        <Link
          href="/review"
          className="rounded-xl bg-accent text-white font-medium py-3 px-4 text-center nav-link"
        >
          保存した表現を復習する
        </Link>
        <Link
          href="/scenarios"
          className="rounded-xl border-2 border-border text-primary font-medium py-3 px-4 text-center hover:bg-slate-50 tap-target min-h-[48px] flex items-center justify-center"
        >
          別の場面を練習する
        </Link>
      </div>
    </div>
  );
}
