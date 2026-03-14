import Link from "next/link";
import type { Scenario } from "@/types";
import { getCategoryLabel } from "@/lib/scenarioMeta";
import { ScenarioIcon } from "./ScenarioIcon";

type Props = { scenario: Scenario };

export function ScenarioCard({ scenario }: Props) {
  const categoryLabel = getCategoryLabel(scenario.category);

  return (
    <Link
      href={`/practice/${scenario.id}`}
      className="block rounded-2xl border border-border bg-white p-5 shadow-sm active:bg-gray-50/80 transition-colors"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-surface flex items-center justify-center">
          <ScenarioIcon scenario={scenario} className="w-7 h-7 text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          {categoryLabel && (
            <span className="inline-block text-xs font-medium text-muted mb-1.5">
              {categoryLabel}
            </span>
          )}
          <h3 className="font-semibold text-primary text-lg leading-tight">
            {scenario.title}
          </h3>
          <p className="text-muted text-sm mt-0.5">{scenario.titleJa}</p>
          <p className="text-muted text-sm mt-2 leading-relaxed">
            {scenario.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
