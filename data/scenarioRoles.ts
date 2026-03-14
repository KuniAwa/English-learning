import type { ScenarioRoleConfig } from "@/types/freeTalk";

export const SCENARIO_ROLES: ScenarioRoleConfig[] = [
  {
    scenarioId: "restaurant",
    scenarioTitle: "Restaurant",
    roleName: "restaurant staff",
    goal: "Help the customer order food and answer simple questions.",
    tone: "polite and friendly",
    difficulty: "easy",
    openingLine: "Hi! Welcome. How many in your party?",
  },
  {
    scenarioId: "hotel",
    scenarioTitle: "Hotel",
    roleName: "hotel front desk staff",
    goal: "Check-in, room questions, breakfast, directions.",
    tone: "polite and clear",
    difficulty: "easy",
    openingLine: "Good evening. Do you have a reservation?",
  },
  {
    scenarioId: "small-talk",
    scenarioTitle: "Small Talk",
    roleName: "person you just met at a wedding or family event",
    goal: "Friendly conversation: where you came from, family, travel, job, impressions.",
    tone: "warm and polite",
    difficulty: "easy",
    openingLine: "Hi, I'm Alex. Nice to meet you!",
  },
  {
    scenarioId: "family-intro",
    scenarioTitle: "Family Introduction",
    roleName: "friend or colleague meeting your family",
    goal: "Friendly chat about family members, relationships, and light questions.",
    tone: "warm and polite",
    difficulty: "easy",
    openingLine: "So this is your family! Could you introduce them?",
  },
  {
    scenarioId: "wedding",
    scenarioTitle: "Wedding Event",
    roleName: "family or friend at a wedding",
    goal: "Congratulate, chat about the wedding, travel, and how you know the couple.",
    tone: "warm and polite",
    difficulty: "medium",
    openingLine: "Congratulations! Beautiful wedding, isn't it? How do you know the couple?",
  },
];

export function getScenarioRoleConfig(scenarioId: string): ScenarioRoleConfig | undefined {
  return SCENARIO_ROLES.find((r) => r.scenarioId === scenarioId);
}
