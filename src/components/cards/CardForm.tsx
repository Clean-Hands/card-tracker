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
  const [lastFourDigits, setLastFourDigits] = useState(
    card?.lastFourDigits ?? ""
  );
  const [notes, setNotes] = useState(card?.notes ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !issuer.trim()) return;

    if (card) {
      updateCard(card.id, {
        name: name.trim(),
        issuer: issuer.trim(),
        annualFee: Number(annualFee) || 0,
        cardColor,
        lastFourDigits: lastFourDigits.trim() || undefined,
        notes: notes.trim() || undefined,
      });
    } else {
      addCard({
        name: name.trim(),
        issuer: issuer.trim(),
        annualFee: Number(annualFee) || 0,
        cardColor,
        lastFourDigits: lastFourDigits.trim() || undefined,
        notes: notes.trim() || undefined,
      });
    }
    onClose();
  };

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={card ? "Edit Card" : "Add Card"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Card Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Sapphire Reserve"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Issuer *</label>
          <input
            type="text"
            value={issuer}
            onChange={(e) => setIssuer(e.target.value)}
            placeholder="e.g., Chase"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Annual Fee ($)</label>
          <input
            type="number"
            value={annualFee}
            onChange={(e) => setAnnualFee(e.target.value)}
            min="0"
            step="1"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Card Color</label>
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
          <label className={labelClass}>Last 4 Digits</label>
          <input
            type="text"
            value={lastFourDigits}
            onChange={(e) =>
              setLastFourDigits(e.target.value.replace(/\D/g, "").slice(0, 4))
            }
            placeholder="1234"
            maxLength={4}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any notes about this card..."
            rows={2}
            className={inputClass}
          />
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            {card ? "Save Changes" : "Add Card"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
