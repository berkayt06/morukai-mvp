export type PlanId = "trial" | "monthly" | "yearly";

export interface Plan {
  id: PlanId;
  nameTr: string;
  nameEn: string;
  priceTry: number; // 0 for trial
  intervalDays: number;
  taglineTr: string;
  taglineEn: string;
  highlight?: boolean;
}

// Edit pricing here.
export const PLANS: Plan[] = [
  {
    id: "trial",
    nameTr: "Deneme",
    nameEn: "Free Trial",
    priceTry: 0,
    intervalDays: 7,
    taglineTr: "7 gün ücretsiz dene",
    taglineEn: "Try free for 7 days",
  },
  {
    id: "monthly",
    nameTr: "Aylık MorukAI",
    nameEn: "Monthly",
    priceTry: 199,
    intervalDays: 30,
    taglineTr: "Her ay yenilenir, istediğinde iptal",
    taglineEn: "Renews monthly, cancel anytime",
    highlight: true,
  },
  {
    id: "yearly",
    nameTr: "Yıllık MorukAI",
    nameEn: "Yearly",
    priceTry: 1499,
    intervalDays: 365,
    taglineTr: "2 ay bedava — yıllık ödeme",
    taglineEn: "2 months free — billed annually",
  },
];

export const getPlan = (id: string): Plan | undefined =>
  PLANS.find((p) => p.id === id);
