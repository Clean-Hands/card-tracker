import { Link } from "react-router-dom";
import { CreditCard } from "lucide-react";
import { useCardStore } from "../../store/useCardStore";
import { ValueSummary } from "./ValueSummary";
import { UnusedBenefitsAlert } from "./UnusedBenefitsAlert";
import { UpcomingExpirations } from "./UpcomingExpirations";
import { BestCardLookup } from "./BestCardLookup";

export function Dashboard() {
	const cards = useCardStore((s) => s.cards);

	if (cards.length === 0) {
		return (
			<div>
				<h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
				<div className="text-center py-16 bg-white rounded-xl border border-gray-200">
					<CreditCard size={48} className="mx-auto text-gray-300 mb-4" />
					<h2 className="text-lg font-medium text-gray-900 mb-2">
						Welcome to Card Tracker
					</h2>
					<p className="text-gray-500 mb-6">
						Add your first credit card to start tracking rewards and benefits.
					</p>
					<Link
						to="/cards"
						className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors inline-block"
					>
						Add Your First Card
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div>
			<h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

			<ValueSummary cards={cards} />

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
				<UnusedBenefitsAlert cards={cards} />
				<BestCardLookup cards={cards} />
			</div>

			<div className="mt-6">
				<UpcomingExpirations cards={cards} />
			</div>
		</div>
	);
}
