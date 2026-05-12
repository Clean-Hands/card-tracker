import { Check, Circle, Edit2, Trash2 } from "lucide-react";
import type { Benefit } from "../../types";
import { useCardStore } from "../../store/useCardStore";
import {
	isBenefitUsedInCurrentPeriod,
	getCurrentPeriodKey,
	getPeriodEndDate,
	getPeriodLabel,
} from "../../lib/periods";

interface BenefitCardProps {
	cardId: string;
	benefit: Benefit;
	onEdit: () => void;
}

export function BenefitCard({ cardId, benefit, onEdit }: BenefitCardProps) {
	const toggleBenefitUsed = useCardStore((s) => s.toggleBenefitUsed);
	const deleteBenefit = useCardStore((s) => s.deleteBenefit);

	const used = isBenefitUsedInCurrentPeriod(benefit);
	const opts = {
		periodYears: benefit.periodYears,
		anchorYear: benefit.periodAnchorYear,
	};
	const periodKey = getCurrentPeriodKey(benefit.period, new Date(), opts);
	const endDate = getPeriodEndDate(benefit.period, new Date(), opts);

	const displayPeriod =
		benefit.period === "multi-year" && benefit.periodYears
			? `${endDate.getFullYear() - benefit.periodYears + 1}–${endDate.getFullYear()}`
			: periodKey;
	const daysLeft = Math.ceil(
		(endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
	);

	const badgeClass =
		daysLeft <= 3 ? "badge-urgent" : daysLeft <= 7 ? "badge-warning" : "badge-neutral";

	return (
		<div
			className={`px-5 py-3 flex items-center gap-3 ${
				used ? "bg-green-50/50" : ""
			}`}
		>
			<button
				type="button"
				onClick={() => toggleBenefitUsed(cardId, benefit.id)}
				className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
					used
						? "bg-green-500 border-green-500 text-white"
						: "border-gray-300 text-gray-300 hover:border-indigo-400 hover:text-indigo-400"
				}`}
			>
				{used ? <Check size={14} /> : <Circle size={14} />}
			</button>

			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2">
					<span
						className={`text-sm font-medium ${
							used ? "text-gray-400 line-through" : "text-gray-800"
						}`}
					>
						{benefit.name}
					</span>
					<span className="text-sm font-semibold text-green-600">
						${benefit.value}
					</span>
				</div>
				<div className="flex items-center gap-2 mt-0.5">
					<span className="text-xs text-gray-400">
						{getPeriodLabel(benefit.period, benefit.periodYears)} &middot; {displayPeriod}
					</span>
					{!used && (
						<span className={badgeClass}>{daysLeft}d left</span>
					)}
					{used && (
						<span className="badge-success">Redeemed</span>
					)}
				</div>
				{benefit.description && (
					<p className="text-xs text-gray-400 mt-0.5">{benefit.description}</p>
				)}
			</div>

			<div className="flex gap-1 flex-shrink-0">
				<button
					type="button"
					onClick={onEdit}
					className="btn-icon-edit"
				>
					<Edit2 size={13} />
				</button>
				<button
					type="button"
					onClick={() => deleteBenefit(cardId, benefit.id)}
					className="btn-icon-delete"
				>
					<Trash2 size={13} />
				</button>
			</div>
		</div>
	);
}
