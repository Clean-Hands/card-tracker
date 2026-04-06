import { AlertTriangle, Check } from "lucide-react";
import { Link } from "react-router-dom";
import type { CreditCard } from "../../types";
import { getUpcomingExpirations } from "../../lib/periods";
import { useCardStore } from "../../store/useCardStore";

interface UnusedBenefitsAlertProps {
	cards: CreditCard[];
}

export function UnusedBenefitsAlert({ cards }: UnusedBenefitsAlertProps) {
	const toggleBenefitUsed = useCardStore((s) => s.toggleBenefitUsed);
	const expirations = getUpcomingExpirations(cards);
	const urgent = expirations.filter((e) => e.daysRemaining <= 7);

	return (
		<div className="card">
			<div className="card-header">
				<h2 className="font-semibold text-gray-900 flex items-center gap-2">
					<AlertTriangle
						size={18}
						className={urgent.length > 0 ? "text-amber-500" : "text-gray-400"}
					/>
					Unused Benefits
				</h2>
			</div>

			<div className="divide-y divide-gray-100 max-h-91 overflow-y-auto">
				{expirations.length === 0 ? (
					<div className="px-5 py-8 text-center">
						<Check size={32} className="mx-auto text-green-400 mb-2" />
						<p className="text-sm text-gray-500">
							All benefits redeemed this period!
						</p>
					</div>
				) : (
					expirations.map((item) => (
						<div
							key={`${item.cardId}-${item.benefitId}`}
							className="px-5 py-3 flex items-center gap-3"
						>
							<div
								className="w-2 h-2 rounded-full flex-shrink-0"
								style={{ backgroundColor: item.cardColor }}
							/>
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2">
									<Link
										to={`/cards/${item.cardId}`}
										className="text-sm font-medium text-gray-800 hover:text-indigo-600 truncate"
									>
										{item.benefitName}
									</Link>
									<span className="text-sm font-semibold text-green-600">
										${item.value}
									</span>
								</div>
								<p className="text-xs text-gray-400">{item.cardName}</p>
							</div>
							<span
								className={`flex-shrink-0 ${
									item.daysRemaining <= 3
										? "badge-urgent"
										: item.daysRemaining <= 7
											? "badge-warning"
											: "badge-neutral"
								}`}
							>
								{item.daysRemaining}d
							</span>
							<button
								type="button"
								onClick={() => toggleBenefitUsed(item.cardId, item.benefitId)}
								className="btn-link-sm text-xs flex-shrink-0"
							>
								Mark Used
							</button>
						</div>
					))
				)}
			</div>
		</div>
	);
}
