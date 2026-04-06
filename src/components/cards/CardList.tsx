import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, Edit2, CreditCard } from "lucide-react";
import { useCardStore } from "../../store/useCardStore";
import { CardForm } from "./CardForm";
import { Modal } from "../ui/Modal";

export function CardList() {
	const cards = useCardStore((s) => s.cards);
	const deleteCard = useCardStore((s) => s.deleteCard);
	const [showForm, setShowForm] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const editingCard = editingId
		? cards.find((c) => c.id === editingId)
		: undefined;

	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">My Cards</h1>
					<p className="text-gray-500 mt-1">
						{cards.length} card{cards.length !== 1 ? "s" : ""} tracked
					</p>
				</div>
				<button
					type="button"
					onClick={() => setShowForm(true)}
					className="btn-primary flex items-center gap-2"
				>
					<Plus size={18} />
					Add Card
				</button>
			</div>

			{cards.length === 0 ? (
				<div className="card text-center py-16">
					<CreditCard size={48} className="mx-auto text-gray-300 mb-4" />
					<h2 className="text-lg font-medium text-gray-900 mb-2">
						No cards yet
					</h2>
					<p className="text-gray-500 mb-6">
						Add your first credit card to start tracking rewards and benefits.
					</p>
					<button
						type="button"
						onClick={() => setShowForm(true)}
						className="btn-primary"
					>
						Add Your First Card
					</button>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{cards.map((card) => (
						<div
							key={card.id}
							className="card overflow-hidden hover:shadow-md transition-shadow"
						>
							<div
								className="h-3"
								style={{ backgroundColor: card.cardColor }}
							/>
							<div className="p-5">
								<div className="flex items-start justify-between mb-3">
									<Link
										to={`/cards/${card.id}`}
										className="hover:text-indigo-600 transition-colors"
									>
										<h3 className="font-semibold text-gray-900">{card.name}</h3>
										<p className="text-sm text-gray-500">{card.issuer}</p>
									</Link>
									<div className="flex gap-1">
										<button
											type="button"
											onClick={() => setEditingId(card.id)}
											className="btn-icon-edit"
										>
											<Edit2 size={14} />
										</button>
										<button
											type="button"
											onClick={() => setDeletingId(card.id)}
											className="btn-icon-delete"
										>
											<Trash2 size={14} />
										</button>
									</div>
								</div>

								<div className="flex items-center gap-4 text-sm text-gray-600">
									<span>
										${card.annualFee}/yr
									</span>
									<span>{card.multipliers.length} categories</span>
									<span>{card.benefits.length} benefits</span>
								</div>

								{card.lastFourDigits && (
									<p className="text-xs text-gray-400 mt-2">
										****{card.lastFourDigits}
									</p>
								)}

								<Link
									to={`/cards/${card.id}`}
									className="btn-link mt-4 block text-center py-2"
								>
									View Details
								</Link>
							</div>
						</div>
					))}
				</div>
			)}

			<CardForm
				open={showForm}
				onClose={() => setShowForm(false)}
			/>

			{editingCard && (
				<CardForm
					open={!!editingId}
					onClose={() => setEditingId(null)}
					card={editingCard}
				/>
			)}

			<Modal
				open={!!deletingId}
				onClose={() => setDeletingId(null)}
				title="Delete Card"
			>
				<p className="text-gray-600 mb-6">
					Are you sure you want to delete this card? All multipliers and benefits
					will be lost.
				</p>
				<div className="flex gap-3 justify-end">
					<button
						type="button"
						onClick={() => setDeletingId(null)}
						className="btn-secondary"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={() => {
							if (deletingId) deleteCard(deletingId);
							setDeletingId(null);
						}}
						className="btn-danger"
					>
						Delete
					</button>
				</div>
			</Modal>
		</div>
	);
}
