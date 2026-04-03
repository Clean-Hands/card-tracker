import { useState } from "react";
import { Modal } from "../ui/Modal";
import { useCardStore } from "../../store/useCardStore";
import type { Benefit, BenefitPeriod } from "../../types";

interface BenefitFormProps {
  open: boolean;
  onClose: () => void;
  cardId: string;
  benefit?: Benefit;
}

export function BenefitForm({ open, onClose, cardId, benefit }: BenefitFormProps) {
  const addBenefit = useCardStore((s) => s.addBenefit);
  const updateBenefit = useCardStore((s) => s.updateBenefit);

  const [name, setName] = useState(benefit?.name ?? "");
  const [value, setValue] = useState(String(benefit?.value ?? ""));
  const [period, setPeriod] = useState<BenefitPeriod>(
    benefit?.period ?? "monthly"
  );
  const [description, setDescription] = useState(benefit?.description ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !value) return;

    if (benefit) {
      updateBenefit(cardId, benefit.id, {
        name: name.trim(),
        value: Number(value) || 0,
        period,
        description: description.trim() || undefined,
      });
    } else {
      addBenefit(cardId, {
        name: name.trim(),
        value: Number(value) || 0,
        period,
        description: description.trim() || undefined,
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
      title={benefit ? "Edit Benefit" : "Add Benefit"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Benefit Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Uber Credit, Streaming Credit"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Value per Period ($) *</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="10"
            min="0"
            step="0.01"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Period</label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as BenefitPeriod)}
            className={inputClass}
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="semi-annual">Semi-Annual</option>
            <option value="annual">Annual</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Use on Uber Eats or rides"
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
            {benefit ? "Save Changes" : "Add Benefit"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
