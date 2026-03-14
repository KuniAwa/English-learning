import Link from "next/link";
import type { Scenario } from "@/types";
import { getCategoryLabel } from "@/lib/scenarioMeta";
import { ScenarioIcon } from "./ScenarioIcon";
import { getScenarioRoleConfig } from "@/data/scenarioRoles";

type Props = { scenario: Scenario };

export function ScenarioCard({ scenario }: Props) {
  const categoryLabel = getCategoryLabel(scenario.category);
  const hasFreeTalk = !!getScenarioRoleConfig(scenario.id);

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <Link
        href={`/practice/${scenario.id}`}
        className="block active:bg-gray-50/80 rounded-xl -m-2 p-2 transition-colors"
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
      {hasFreeTalk && (
        <div className="mt-3 pt-3 border-t border-border flex gap-2">
          <Link
            href={`/practice/${scenario.id}`}
            className="flex-1 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-medium text-primary text-center hover:bg-slate-50 tap-target min-h-[44px] flex items-center justify-center"
          >
            固定シナリオで練習
          </Link>
          <Link
            href={`/practice/${scenario.id}/free`}
            className="flex-1 rounded-xl bg-accent text-white px-4 py-2.5 text-sm font-medium text-center hover:bg-blue-800 tap-target min-h-[44px] flex items-center justify-center"
          >
            AIフリートーク
          </Link>
        </div>
      )}
    </div>
  );
}
