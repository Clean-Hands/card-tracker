export type CardId = string;
export type BenefitId = string;

export type BenefitPeriod =
	| "monthly"
	| "quarterly"
	| "semi-annual"
	| "annual"
	| "multi-year";

export type CapPeriod = "monthly" | "quarterly" | "semi-annual" | "annual";

export interface SpendingMultiplier {
	category: string;
	multiplier: number;
	notes?: string;
	capAmount?: number;
	capPeriod?: CapPeriod;
}

export interface UsageRecord {
	periodKey: string;
	used: boolean;
	usedDate?: string;
	notes?: string;
}

export interface Benefit {
	id: BenefitId;
	name: string;
	value: number;
	period: BenefitPeriod;
	periodYears?: number; // required when period === "multi-year"
	periodAnchorYear?: number; // start year of the first window for multi-year benefits
	description?: string;
	usageHistory: UsageRecord[];
}

export interface CreditCard {
	id: CardId;
	name: string;
	issuer: string;
	annualFee: number;
	cardColor: string;
	pointValue: number; // cents per point (e.g. 1.2 for Delta SkyMiles)
	rewardsCurrency?: string; // e.g. "SkyMiles", "Ultimate Rewards", "ThankYou Points"
	multipliers: SpendingMultiplier[];
	benefits: Benefit[];
	lastFourDigits?: string;
	notes?: string;
}

export interface ExpirationItem {
	cardId: string;
	cardName: string;
	cardColor: string;
	benefitId: string;
	benefitName: string;
	value: number;
	period: BenefitPeriod;
	periodYears?: number;
	periodAnchorYear?: number;
	endDate: Date;
	daysRemaining: number;
}
