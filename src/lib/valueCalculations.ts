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
	const year = now.getFullYear();
	const yearStr = String(year);

	for (const card of cards) {
		totalAnnualFees += card.annualFee;

		for (const benefit of card.benefits) {
			const annualValue =
				benefit.value * getAnnualFrequency(benefit.period, benefit.periodYears);
			totalPotentialValue += annualValue;

			if (isBenefitUsedInCurrentPeriod(benefit)) {
				totalRedeemedThisPeriod += benefit.value;
			} else {
				totalUnusedThisPeriod += benefit.value;
			}

			const currentPeriodKey = getCurrentPeriodKey(benefit.period, now, {
				periodYears: benefit.periodYears,
				anchorYear: benefit.periodAnchorYear,
			});

			// Count any redemption with a usedDate in the current year
			// (or, for legacy records without usedDate, fall back to periodKey prefix)
			for (const record of benefit.usageHistory) {
				if (!record.used) continue;
				if (record.periodKey === currentPeriodKey) continue; // handled below

				const inCurrentYear = record.usedDate
					? new Date(record.usedDate).getFullYear() === year
					: record.periodKey.startsWith(yearStr);

				if (inCurrentYear) {
					totalRedeemedAllTime += benefit.value;
				}
			}

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
