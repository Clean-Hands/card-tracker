import { useState } from "react";
import { Plus } from "lucide-react";
import type { Benefit } from "../../types";
import { BenefitCard } from "./BenefitCard";
import { BenefitForm } from "./BenefitForm";

interface BenefitListProps {
	cardId: string;
	benefits: Benefit[];
}

export function BenefitList({ cardId, benefits }: BenefitListProps) {
	const [showForm, setShowForm] = useState(false);
	const [editingBenefit, setEditingBenefit] = useState<Benefit | null>(null);

	const grouped = {
		monthly: benefits.filter((b) => b.period === "monthly"),
		quarterly: benefits.filter((b) => b.period === "quarterly"),
		"semi-annual": benefits.filter((b) => b.period === "semi-annual"),
		annual: benefits.filter((b) => b.period === "annual"),
		"multi-year": benefits
			.filter((b) => b.period === "multi-year")
			.sort((a, b) => (a.periodYears ?? 0) - (b.periodYears ?? 0)),
	};

	const periodLabels = {
		monthly: "Monthly",
		quarterly: "Quarterly",
		"semi-annual": "Semi-Annual",
		annual: "Annual",
		"multi-year": "Multi-Year",
	} as const;

	const periods = (
		["monthly", "quarterly", "semi-annual", "annual", "multi-year"] as const
	).filter((p) => grouped[p].length > 0);

	return (
		<div className="card">
			<div className="card-header flex items-center justify-between">
				<h2 className="font-semibold text-gray-900">Benefits & Credits</h2>
				<button
					type="button"
					onClick={() => setShowForm(true)}
					className="btn-link-sm"
				>
					<Plus size={16} />
					Add
				</button>
			</div>

			{benefits.length === 0 ? (
				<p className="px-5 py-8 text-center text-gray-400 text-sm">
					No benefits tracked. Add credits and perks that come with this card.
				</p>
			) : (
				<div className="divide-y divide-gray-100">
					{periods.map((period) => (
						<div key={period}>
							<div className="px-5 py-2 bg-gray-50">
								<h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
									{periodLabels[period]}
								</h3>
							</div>
							{grouped[period].map((benefit) => (
								<BenefitCard
									key={benefit.id}
									cardId={cardId}
									benefit={benefit}
									onEdit={() => setEditingBenefit(benefit)}
								/>
							))}
						</div>
					))}
				</div>
			)}

			<BenefitForm
				open={showForm}
				onClose={() => setShowForm(false)}
				cardId={cardId}
			/>

			{editingBenefit && (
				<BenefitForm
					open={!!editingBenefit}
					onClose={() => setEditingBenefit(null)}
					cardId={cardId}
					benefit={editingBenefit}
				/>
			)}
		</div>
	);
}
