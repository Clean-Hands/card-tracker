import { useState } from "react";
import { DollarSign, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import type { CreditCard } from "../../types";
import {
	calculateValueSummary,
	getYearRedemptions,
} from "../../lib/valueCalculations";
import { Modal } from "../ui/Modal";

interface ValueSummaryProps {
	cards: CreditCard[];
}

export function ValueSummary({ cards }: ValueSummaryProps) {
	const summary = calculateValueSummary(cards);
	const [showRedemptions, setShowRedemptions] = useState(false);
	const year = new Date().getFullYear();
	const redemptions = getYearRedemptions(cards, year);

	const stats = [
		{
			label: "Total Annual Fees",
			value: `$${summary.totalAnnualFees.toLocaleString()}`,
			icon: Wallet,
			color: "text-gray-600",
			bg: "bg-gray-100",
			onClick: undefined,
		},
		{
			label: "Potential Annual Value",
			value: `$${summary.totalPotentialValue.toLocaleString()}`,
			icon: TrendingUp,
			color: "text-green-600",
			bg: "bg-green-100",
			onClick: undefined,
		},
		{
			label: "Redeemed This Year",
			value: `$${summary.totalRedeemedAllTime.toLocaleString()}`,
			icon: DollarSign,
			color: "text-indigo-600",
			bg: "bg-indigo-100",
			onClick: () => setShowRedemptions(true),
		},
		{
			label: "Net Value (Redeemed - Fees)",
			value: `${summary.netValue >= 0 ? "+" : "-"}$${Math.abs(summary.netValue).toLocaleString()}`,
			icon: summary.netValue >= 0 ? TrendingUp : TrendingDown,
			color: summary.netValue >= 0 ? "text-green-600" : "text-red-600",
			bg: summary.netValue >= 0 ? "bg-green-100" : "bg-red-100",
			onClick: undefined,
		},
	];

	return (
		<>
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				{stats.map((stat) =>
					stat.onClick ? (
						<button
							key={stat.label}
							type="button"
							onClick={stat.onClick}
							className="card p-5 text-left hover:shadow-md hover:border-indigo-300 transition-all"
						>
							<div className="flex items-center gap-3 mb-3">
								<div className={`p-2 rounded-lg ${stat.bg}`}>
									<stat.icon size={18} className={stat.color} />
								</div>
								<span className="text-sm text-gray-500">{stat.label}</span>
							</div>
							<p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
						</button>
					) : (
						<div key={stat.label} className="card p-5">
							<div className="flex items-center gap-3 mb-3">
								<div className={`p-2 rounded-lg ${stat.bg}`}>
									<stat.icon size={18} className={stat.color} />
								</div>
								<span className="text-sm text-gray-500">{stat.label}</span>
							</div>
							<p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
						</div>
					)
				)}
			</div>

			<Modal
				open={showRedemptions}
				onClose={() => setShowRedemptions(false)}
				title={`Redemptions in ${year}`}
			>
				{redemptions.length === 0 ? (
					<p className="text-center text-sm text-gray-400 py-6">
						No redemptions yet this year.
					</p>
				) : (
					<div className="space-y-2">
						<div className="divide-y divide-gray-100 -mx-2">
							{redemptions.map((r, i) => (
								<div
									key={`${r.benefitId}-${r.periodKey}-${i}`}
									className="flex items-center gap-3 px-2 py-2.5"
								>
									<div
										className="w-2 h-2 rounded-full flex-shrink-0"
										style={{ backgroundColor: r.cardColor }}
									/>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-gray-800 truncate">
											{r.benefitName}
										</p>
										<Link
											to={`/cards/${r.cardId}`}
											onClick={() => setShowRedemptions(false)}
											className="text-xs text-gray-500 hover:text-indigo-600"
										>
											{r.cardName}
										</Link>
									</div>
									<div className="text-right flex-shrink-0">
										<p className="text-sm font-semibold text-green-600">
											${r.value.toLocaleString()}
										</p>
										<p className="text-xs text-gray-400">
											{r.usedDate
												? new Date(r.usedDate).toLocaleDateString()
												: r.periodKey}
										</p>
									</div>
								</div>
							))}
						</div>
						<div className="flex justify-between items-center pt-3 mt-2 border-t border-gray-200 px-2">
							<span className="text-sm font-medium text-gray-700">Total</span>
							<span className="text-base font-bold text-indigo-600">
								${summary.totalRedeemedAllTime.toLocaleString()}
							</span>
						</div>
					</div>
				)}
			</Modal>
		</>
	);
}
