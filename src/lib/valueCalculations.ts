import type { CreditCard } from "../types";
import {
  getAnnualFrequency,
  getCurrentPeriodKey,
  isBenefitUsedInCurrentPeriod,
} from "./periods";

export interface ValueSummaryData {
  totalAnnualFees: number;
  totalPotentialValue: number;
  totalRedeemedThisPeriod: number;
  totalUnusedThisPeriod: number;
  totalRedeemedAllTime: number;
  netValue: number;
}

export function calculateValueSummary(cards: CreditCard[]): ValueSummaryData {
  let totalAnnualFees = 0;
  let totalPotentialValue = 0;
  let totalRedeemedThisPeriod = 0;
  let totalUnusedThisPeriod = 0;
  let totalRedeemedAllTime = 0;

  const now = new Date();
  const year = String(now.getFullYear());

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

      // Sum all redeemed periods within the current year
      const currentPeriodKey = getCurrentPeriodKey(benefit.period, now);
      for (const record of benefit.usageHistory) {
        if (record.used && record.periodKey.startsWith(year)) {
          // Avoid double-counting the current period (already in totalRedeemedThisPeriod)
          if (record.periodKey !== currentPeriodKey) {
            totalRedeemedAllTime += benefit.value;
          }
        }
      }
      // Add current period if used
      if (isBenefitUsedInCurrentPeriod(benefit)) {
        totalRedeemedAllTime += benefit.value;
      }
    }
  }

  return {
    totalAnnualFees,
    totalPotentialValue,
    totalRedeemedThisPeriod,
    totalUnusedThisPeriod,
    totalRedeemedAllTime,
    netValue: totalRedeemedAllTime - totalAnnualFees,
  };
}
