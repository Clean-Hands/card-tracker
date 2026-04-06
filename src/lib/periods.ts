import type { Benefit, BenefitPeriod, CreditCard, ExpirationItem } from "../types";

export function getCurrentPeriodKey(
	period: BenefitPeriod,
	ref: Date = new Date()
): string {
	const year = ref.getFullYear();
	const month = ref.getMonth();

	switch (period) {
		case "monthly":
			return `${year}-${String(month + 1).padStart(2, "0")}`;
		case "quarterly": {
			const quarter = Math.floor(month / 3) + 1;
			return `${year}-Q${quarter}`;
		}
		case "semi-annual": {
			const half = month < 6 ? 1 : 2;
			return `${year}-H${half}`;
		}
		case "annual":
			return `${year}`;
	}
}

export function getPeriodEndDate(
	period: BenefitPeriod,
	ref: Date = new Date()
): Date {
	const year = ref.getFullYear();
	const month = ref.getMonth();

	switch (period) {
		case "monthly":
			return new Date(year, month + 1, 0, 23, 59, 59);
		case "quarterly": {
			const quarterEnd = Math.floor(month / 3) * 3 + 3;
			return new Date(year, quarterEnd, 0, 23, 59, 59);
		}
		case "semi-annual":
			if (month < 6) return new Date(year, 6, 0, 23, 59, 59);
			return new Date(year, 12, 0, 23, 59, 59);
		case "annual":
			return new Date(year, 12, 0, 23, 59, 59);
	}
}

export function getPeriodLabel(period: BenefitPeriod): string {
	switch (period) {
		case "monthly":
			return "Monthly";
		case "quarterly":
			return "Quarterly";
		case "semi-annual":
			return "Semi-Annual";
		case "annual":
			return "Annual";
	}
}

export function getPeriodShortLabel(period: string): string {
	switch (period) {
		case "monthly":
			return "/mo";
		case "quarterly":
			return "/qtr";
		case "semi-annual":
			return "/6mo";
		case "annual":
			return "/yr";
		default:
			return "";
	}
}

export function getAnnualFrequency(period: BenefitPeriod): number {
	switch (period) {
		case "monthly":
			return 12;
		case "quarterly":
			return 4;
		case "semi-annual":
			return 2;
		case "annual":
			return 1;
	}
}

export function isBenefitUsedInCurrentPeriod(benefit: Benefit): boolean {
	const currentKey = getCurrentPeriodKey(benefit.period);
	return benefit.usageHistory.some(
		(r) => r.periodKey === currentKey && r.used
	);
}

export function getUpcomingExpirations(cards: CreditCard[]): ExpirationItem[] {
	const now = new Date();
	const items: ExpirationItem[] = [];

	for (const card of cards) {
		for (const benefit of card.benefits) {
			if (!isBenefitUsedInCurrentPeriod(benefit)) {
				const endDate = getPeriodEndDate(benefit.period, now);
				const daysRemaining = Math.ceil(
					(endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
				);
				items.push({
					cardId: card.id,
					cardName: card.name,
					cardColor: card.cardColor,
					benefitId: benefit.id,
					benefitName: benefit.name,
					value: benefit.value,
					period: benefit.period,
					endDate,
					daysRemaining,
				});
			}
		}
	}

	return items.sort((a, b) => a.daysRemaining - b.daysRemaining);
}
