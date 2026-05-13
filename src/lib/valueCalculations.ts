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

export interface RedemptionRecord {
	cardId: string;
	cardName: string;
	cardColor: string;
	benefitId: string;
	benefitName: string;
	value: number;
	usedDate?: string;
	periodKey: string;
}

export function getYearRedemptions(
	cards: CreditCard[],
	year: number = new Date().getFullYear()
): RedemptionRecord[] {
	const yearStr = String(year);
	const out: RedemptionRecord[] = [];

	for (const card of cards) {
		for (const benefit of card.benefits) {
			for (const record of benefit.usageHistory) {
				if (!record.used) continue;
				const inYear = record.usedDate
					? new Date(record.usedDate).getFullYear() === year
					: record.periodKey.startsWith(yearStr);
				if (!inYear) continue;
				out.push({
					cardId: card.id,
					cardName: card.name,
					cardColor: card.cardColor,
					benefitId: benefit.id,
					benefitName: benefit.name,
					value: benefit.value,
					usedDate: record.usedDate,
					periodKey: record.periodKey,
				});
			}
		}
	}

	return out.sort((a, b) => {
		const aT = a.usedDate ? new Date(a.usedDate).getTime() : 0;
		const bT = b.usedDate ? new Date(b.usedDate).getTime() : 0;
		return bT - aT;
	});
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
