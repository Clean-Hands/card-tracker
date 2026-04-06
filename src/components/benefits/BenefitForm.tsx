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

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={benefit ? "Edit Benefit" : "Add Benefit"}
		>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="form-label">Benefit Name *</label>
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="e.g., Uber Credit, Streaming Credit"
						className="form-input"
						required
					/>
				</div>

				<div>
					<label className="form-label">Value per Period ($) *</label>
					<input
						type="number"
						value={value}
						onChange={(e) => setValue(e.target.value)}
						placeholder="10"
						min="0"
						step="0.01"
						className="form-input"
						required
					/>
				</div>

				<div>
					<label className="form-label">Period</label>
					<select
						value={period}
						onChange={(e) => setPeriod(e.target.value as BenefitPeriod)}
						className="form-input"
					>
						<option value="monthly">Monthly</option>
						<option value="quarterly">Quarterly</option>
						<option value="semi-annual">Semi-Annual</option>
						<option value="annual">Annual</option>
					</select>
				</div>

				<div>
					<label className="form-label">Description</label>
					<textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="e.g., Use on Uber Eats or rides"
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
						{benefit ? "Save Changes" : "Add Benefit"}
					</button>
				</div>
			</form>
		</Modal>
	);
}
