import { useState } from "react";
import { Modal } from "../ui/Modal";
import { useCardStore } from "../../store/useCardStore";
import { CARD_COLORS } from "../../data/defaultCategories";

const DEFAULT_COLOR = "#4f46e5";
import type { CreditCard } from "../../types";

interface CardFormProps {
	open: boolean;
	onClose: () => void;
	card?: CreditCard;
}

export function CardForm({ open, onClose, card }: CardFormProps) {
	const addCard = useCardStore((s) => s.addCard);
	const updateCard = useCardStore((s) => s.updateCard);

	const [name, setName] = useState(card?.name ?? "");
	const [issuer, setIssuer] = useState(card?.issuer ?? "");
	const [annualFee, setAnnualFee] = useState(String(card?.annualFee ?? "0"));
	const [cardColor, setCardColor] = useState(card?.cardColor ?? DEFAULT_COLOR);
	const [pointValue, setPointValue] = useState(
		String(card?.pointValue ?? "1")
	);
	const [rewardsCurrency, setRewardsCurrency] = useState(
		card?.rewardsCurrency ?? ""
	);
	const [lastFourDigits, setLastFourDigits] = useState(
		card?.lastFourDigits ?? ""
	);
	const [notes, setNotes] = useState(card?.notes ?? "");

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!name.trim() || !issuer.trim()) return;

		const shared = {
			name: name.trim(),
			issuer: issuer.trim(),
			annualFee: Number(annualFee) || 0,
			cardColor,
			pointValue: Number(pointValue) || 1,
			rewardsCurrency: rewardsCurrency.trim() || undefined,
			lastFourDigits: lastFourDigits.trim() || undefined,
			notes: notes.trim() || undefined,
		};

		if (card) {
			updateCard(card.id, shared);
		} else {
			addCard(shared);
		}
		onClose();
	};

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={card ? "Edit Card" : "Add Card"}
		>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="form-label">Card Name *</label>
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="e.g., Sapphire Reserve"
						className="form-input"
						required
					/>
				</div>

				<div>
					<label className="form-label">Issuer *</label>
					<input
						type="text"
						value={issuer}
						onChange={(e) => setIssuer(e.target.value)}
						placeholder="e.g., Chase"
						className="form-input"
						required
					/>
				</div>

				<div>
					<label className="form-label">Annual Fee ($)</label>
					<input
						type="number"
						value={annualFee}
						onChange={(e) => setAnnualFee(e.target.value)}
						min="0"
						step="1"
						className="form-input"
					/>
				</div>

				<div>
					<label className="form-label">Point Value (cents per point)</label>
					<input
						type="number"
						value={pointValue}
						onChange={(e) => setPointValue(e.target.value)}
						min="0.1"
						step="0.1"
						placeholder="1.0"
						className="form-input"
					/>
					<p className="text-xs text-gray-400 mt-1">
						e.g., 1.2 for Delta SkyMiles, 2.0 for Chase Ultimate Rewards via travel portal
					</p>
				</div>

				<div>
					<label className="form-label">Rewards Currency</label>
					<input
						type="text"
						value={rewardsCurrency}
						onChange={(e) => setRewardsCurrency(e.target.value)}
						placeholder="e.g., SkyMiles, Ultimate Rewards, ThankYou Points"
						className="form-input"
					/>
				</div>

				<div>
					<label className="form-label">Card Color</label>
					<div className="flex items-center gap-3">
						<div className="relative">
							<input
								type="color"
								value={cardColor}
								onChange={(e) => setCardColor(e.target.value)}
								className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
							/>
							<div
								className="w-10 h-10 rounded-lg border-2 border-gray-300 cursor-pointer"
								style={{ backgroundColor: cardColor }}
							/>
						</div>
						<div className="flex gap-1.5 flex-wrap">
							{CARD_COLORS.map((color) => (
								<button
									key={color}
									type="button"
									title={color}
									onClick={() => setCardColor(color)}
									className={`w-6 h-6 rounded-full border-2 transition-all ${
										cardColor === color
											? "border-gray-900 scale-110"
											: "border-transparent hover:border-gray-300"
									}`}
									style={{ backgroundColor: color }}
								/>
							))}
						</div>
					</div>
				</div>

				<div>
					<label className="form-label">Last 4 Digits</label>
					<input
						type="text"
						value={lastFourDigits}
						onChange={(e) =>
							setLastFourDigits(e.target.value.replace(/\D/g, "").slice(0, 4))
						}
						placeholder="1234"
						maxLength={4}
						className="form-input"
					/>
				</div>

				<div>
					<label className="form-label">Notes</label>
					<textarea
						value={notes}
						onChange={(e) => setNotes(e.target.value)}
						placeholder="Any notes about this card..."
						rows={2}
						className="form-input"
					/>
				</div>

				<div className="flex gap-3 justify-end pt-2">
					<button
						type="button"
						onClick={onClose}
						className="btn-secondary"
					>
						Cancel
					</button>
					<button
						type="submit"
						className="btn-primary"
					>
						{card ? "Save Changes" : "Add Card"}
					</button>
				</div>
			</form>
		</Modal>
	);
}
