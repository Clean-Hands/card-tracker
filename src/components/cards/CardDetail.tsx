import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2 } from "lucide-react";
import { useState } from "react";
import { useCardStore } from "../../store/useCardStore";
import { MultiplierTable } from "../multipliers/MultiplierTable";
import { BenefitList } from "../benefits/BenefitList";
import { CardForm } from "./CardForm";

export function CardDetail() {
	const { id } = useParams<{ id: string }>();
	const cards = useCardStore((s) => s.cards);
	const card = cards.find((c) => c.id === id);
	const navigate = useNavigate();
	const [editing, setEditing] = useState(false);

	if (!card) {
		return (
			<div className="text-center py-16">
				<p className="text-gray-500 mb-4">Card not found.</p>
				<Link
					to="/cards"
					className="text-indigo-600 hover:text-indigo-700 font-medium"
				>
					Back to My Cards
				</Link>
			</div>
		);
	}

	return (
		<div>
			<button
				onClick={() => navigate("/cards")}
				className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"
			>
				<ArrowLeft size={16} />
				Back to My Cards
			</button>

			<div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
				<div className="h-3" style={{ backgroundColor: card.cardColor }} />
				<div className="p-6">
					<div className="flex items-start justify-between">
						<div>
							<h1 className="text-2xl font-bold text-gray-900">{card.name}</h1>
							<p className="text-gray-500 mt-1">{card.issuer}</p>
						</div>
						<div className="flex items-center gap-4">
							{card.pointValue !== 1 && (
								<span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
									{card.pointValue}cpp
									{card.rewardsCurrency ? ` ${card.rewardsCurrency}` : ""}
								</span>
							)}
							<span className="text-lg font-semibold text-gray-700">
								${card.annualFee}/yr
							</span>
							<button
								onClick={() => setEditing(true)}
								className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
							>
								<Edit2 size={18} />
							</button>
						</div>
					</div>
					{card.lastFourDigits && (
						<p className="text-sm text-gray-400 mt-2">
							****{card.lastFourDigits}
						</p>
					)}
					{card.notes && (
						<p className="text-sm text-gray-500 mt-3 bg-gray-50 p-3 rounded-lg">
							{card.notes}
						</p>
					)}
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<MultiplierTable cardId={card.id} multipliers={card.multipliers} />
				<BenefitList cardId={card.id} benefits={card.benefits} />
			</div>

			<CardForm open={editing} onClose={() => setEditing(false)} card={card} />
		</div>
	);
}
