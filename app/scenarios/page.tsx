import Link from "next/link";
import { getScenariosByCategory } from "@/lib/scenarios";
import { getCategoryLabel } from "@/lib/scenarioMeta";
import { ScenarioCard } from "@/components/ScenarioCard";
export default function ScenariosPage() {
  const byCategory = getScenariosByCategory();

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <Link
        href="/"
        className="text-accent text-sm font-medium inline-block py-2 -ml-1 nav-link min-h-0"
      >
        ← ホーム
      </Link>
      <h1 className="text-xl font-bold text-primary mt-2">場面を選ぶ</h1>
      <p className="text-muted text-sm mt-1">
        練習したいシナリオをタップしてください。
      </p>

      <div className="mt-8 space-y-8">
        {byCategory.map(({ category, scenarios }) => (
          <section key={category}>
            <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">
              {getCategoryLabel(category)}
            </h2>
            <ul className="space-y-4">
              {scenarios.map((s) => (
                <li key={s.id}>
                  <ScenarioCard scenario={s} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
