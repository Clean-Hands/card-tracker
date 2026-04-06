import { useState } from "react";
import { Search, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import type { CreditCard } from "../../types";
import {
	getCardsRankedForCategory,
	getAllCategories,
} from "../../lib/bestCard";
import { getPeriodShortLabel } from "../../lib/periods";

interface BestCardLookupProps {
	cards: CreditCard[];
}

export function BestCardLookup({ cards }: BestCardLookupProps) {
	const allCategories = getAllCategories(cards);
	const [selectedCategory, setSelectedCategory] = useState(
		allCategories[0] ?? ""
	);

	const rankings = selectedCategory
		? getCardsRankedForCategory(cards, selectedCategory)
		: [];

	return (
		<div className="card">
			<div className="card-header">
				<h2 className="font-semibold text-gray-900 flex items-center gap-2">
					<Search size={18} className="text-gray-400" />
					Best Card by Category
				</h2>
			</div>

			<div className="px-5 py-3 border-b border-gray-100">
				<select
					value={selectedCategory}
					onChange={(e) => setSelectedCategory(e.target.value)}
					className="form-input bg-white"
				>
					{allCategories.length === 0 && (
						<option value="">No categories yet</option>
					)}
					{allCategories.map((cat) => (
						<option key={cat} value={cat}>
							{cat}
						</option>
					))}
				</select>
			</div>

			<div className="divide-y divide-gray-100 max-h-75 overflow-y-auto">
				{rankings.length === 0 ? (
					<p className="px-5 py-6 text-center text-sm text-gray-400">
						{allCategories.length === 0
							? "Add multipliers to your cards to see rankings."
							: "No cards have this category."}
					</p>
				) : (
					rankings.map((rank, i) => (
						<div
							key={rank.cardId}
							className={`px-5 py-3 flex items-center gap-3 ${
								i === 0 ? "bg-amber-50/50" : ""
							}`}
						>
							{i === 0 ? (
								<Trophy size={16} className="text-amber-500 flex-shrink-0" />
							) : (
								<span className="w-4 text-center text-xs text-gray-400 flex-shrink-0">
									{i + 1}
								</span>
							)}
							<div
								className="w-2 h-2 rounded-full flex-shrink-0"
								style={{ backgroundColor: rank.cardColor }}
							/>
							<div className="flex-1 min-w-0">
								<Link
									to={`/cards/${rank.cardId}`}
									className="text-sm font-medium text-gray-800 hover:text-indigo-600"
								>
									{rank.cardName}
								</Link>
								<p className="text-xs text-gray-400">{rank.issuer}</p>
							</div>
							<div className="text-right flex-shrink-0">
								<span
									className={`text-sm font-bold ${
										i === 0 ? "text-amber-600" : "text-indigo-600"
									}`}
								>
									{rank.effectiveValue}x
								</span>
								{rank.pointValue !== 1 && (
									<p className="text-xs text-gray-400">
										{rank.multiplier}x &times; {rank.pointValue}cpp
										{rank.rewardsCurrency ? ` (${rank.rewardsCurrency})` : ""}
									</p>
								)}
								{rank.capAmount && (
									<p className="text-xs text-gray-400">
										cap: ${rank.capAmount.toLocaleString()}{getPeriodShortLabel(rank.capPeriod ?? "annual")}
									</p>
								)}
								{rank.notes && (
									<p className="text-xs text-gray-400">{rank.notes}</p>
								)}
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}
