import type { AIFeedback } from "@/types/feedback";

type Props = { feedback: AIFeedback };

const SECTIONS: { key: keyof AIFeedback; label: string }[] = [
  { key: "positive", label: "良い点" },
  { key: "improvement", label: "改善ポイント" },
  { key: "natural", label: "より自然な表現" },
  { key: "short", label: "より短く言う言い方" },
  { key: "polite", label: "丁寧な言い方" },
  { key: "explanationJa", label: "解説" },
];

export function AIFeedbackDisplay({ feedback }: Props) {
  return (
    <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-4 text-left">
      {SECTIONS.map(({ key, label }) => {
        const value = feedback[key];
        if (value == null || value === "" || value === "None" || value === "—") return null;
        const isPositive = key === "positive";
        const isExplanation = key === "explanationJa";
        return (
          <div key={key}>
            <p className="text-xs font-medium text-muted uppercase tracking-wide">{label}</p>
            <p
              className={
                isPositive
                  ? "text-green-800 font-medium mt-1 leading-relaxed"
                  : isExplanation
                    ? "text-muted text-sm mt-1 leading-relaxed"
                    : "text-accent font-medium mt-1 leading-relaxed"
              }
            >
              {value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
