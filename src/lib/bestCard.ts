import type { CapPeriod, CreditCard } from "../types";

export interface CategoryRanking {
	cardId: string;
	cardName: string;
	cardColor: string;
	issuer: string;
	multiplier: number;
	pointValue: number;
	effectiveValue: number; // multiplier * pointValue (cents per dollar spent)
	rewardsCurrency?: string;
	notes?: string;
	capAmount?: number;
	capPeriod?: CapPeriod;
}

export function getCardsRankedForCategory(
	cards: CreditCard[],
	category: string
): CategoryRanking[] {
	const rankings: CategoryRanking[] = [];

	for (const card of cards) {
		let match = card.multipliers.find(
			(m) => m.category.toLowerCase() === category.toLowerCase()
		);

		if (!match) {
			match = card.multipliers.find(
				(m) => m.category.toLowerCase() === "everything else"
			);
		}

		if (match) {
			const pv = card.pointValue ?? 1;
			rankings.push({
				cardId: card.id,
				cardName: card.name,
				cardColor: card.cardColor,
				issuer: card.issuer,
				multiplier: match.multiplier,
				pointValue: pv,
				effectiveValue: Math.round(match.multiplier * pv * 100) / 100,
				rewardsCurrency: card.rewardsCurrency,
				notes: match.notes,
				capAmount: match.capAmount,
				capPeriod: match.capPeriod,
			});
		}
	}

	return rankings.sort((a, b) => {
		if (b.effectiveValue !== a.effectiveValue)
			return b.effectiveValue - a.effectiveValue;
		return a.cardName.localeCompare(b.cardName);
	});
}

export function getAllCategories(cards: CreditCard[]): string[] {
	const categories = new Set<string>();
	for (const card of cards) {
		for (const m of card.multipliers) {
			categories.add(m.category);
		}
	}
	return Array.from(categories).sort((a, b) => {
		if (a === "Everything Else") return 1;
		if (b === "Everything Else") return -1;
		return a.localeCompare(b);
	});
}
