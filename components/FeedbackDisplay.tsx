import type { Feedback, FeedbackTone } from "@/types";

const TONE_LABELS: Record<FeedbackTone, string> = {
  formal: "丁寧な言い方",
  casual: "カジュアルな言い方",
  neutral: "どちらでも使える",
};

type Props = { feedback: Feedback };

export function FeedbackDisplay({ feedback }: Props) {
  const toneLabel = feedback.tone ? TONE_LABELS[feedback.tone] : null;

  return (
    <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-4 text-left">
      <div>
        <p className="text-xs font-medium text-muted uppercase tracking-wide">アドバイス</p>
        <p className="text-primary mt-1 leading-relaxed">{feedback.correction}</p>
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <p className="text-xs font-medium text-muted uppercase tracking-wide">別の言い方を見る</p>
          {toneLabel && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-muted">
              {toneLabel}
            </span>
          )}
        </div>
        <p className="text-accent font-medium text-base mt-0.5 leading-relaxed">
          {feedback.naturalAlternative}
        </p>
      </div>
      <div>
        <p className="text-xs font-medium text-muted uppercase tracking-wide">解説</p>
        <p className="text-muted text-sm mt-1 leading-relaxed">{feedback.explanationJa}</p>
      </div>
    </div>
  );
}
