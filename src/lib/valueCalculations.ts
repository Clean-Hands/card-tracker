import type { CreditCard } from "../types";
import { getAnnualFrequency, isBenefitUsedInCurrentPeriod } from "./periods";

export interface ValueSummaryData {
  totalAnnualFees: number;
  totalPotentialValue: number;
  totalRedeemedThisPeriod: number;
  totalUnusedThisPeriod: number;
  netValue: number;
}

export function calculateValueSummary(cards: CreditCard[]): ValueSummaryData {
  let totalAnnualFees = 0;
  let totalPotentialValue = 0;
  let totalRedeemedThisPeriod = 0;
  let totalUnusedThisPeriod = 0;

  for (const card of cards) {
    totalAnnualFees += card.annualFee;

    for (const benefit of card.benefits) {
      const annualValue = benefit.value * getAnnualFrequency(benefit.period);
      totalPotentialValue += annualValue;

      if (isBenefitUsedInCurrentPeriod(benefit)) {
        totalRedeemedThisPeriod += benefit.value;
      } else {
        totalUnusedThisPeriod += benefit.value;
      }
    }
  }

  return {
    totalAnnualFees,
    totalPotentialValue,
    totalRedeemedThisPeriod,
    totalUnusedThisPeriod,
    netValue: totalPotentialValue - totalAnnualFees,
  };
}
