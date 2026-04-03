import { DollarSign, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import type { CreditCard } from "../../types";
import { calculateValueSummary } from "../../lib/valueCalculations";

interface ValueSummaryProps {
  cards: CreditCard[];
}

export function ValueSummary({ cards }: ValueSummaryProps) {
  const summary = calculateValueSummary(cards);

  const stats = [
    {
      label: "Total Annual Fees",
      value: `$${summary.totalAnnualFees.toLocaleString()}`,
      icon: Wallet,
      color: "text-gray-600",
      bg: "bg-gray-100",
    },
    {
      label: "Potential Annual Value",
      value: `$${summary.totalPotentialValue.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Redeemed This Year",
      value: `$${summary.totalRedeemedAllTime.toLocaleString()}`,
      icon: DollarSign,
      color: "text-indigo-600",
      bg: "bg-indigo-100",
    },
    {
      label: "Net Value (Redeemed - Fees)",
      value: `${summary.netValue >= 0 ? "+" : "-"}$${Math.abs(summary.netValue).toLocaleString()}`,
      icon: summary.netValue >= 0 ? TrendingUp : TrendingDown,
      color: summary.netValue >= 0 ? "text-green-600" : "text-red-600",
      bg: summary.netValue >= 0 ? "bg-green-100" : "bg-red-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl border border-gray-200 p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg ${stat.bg}`}>
              <stat.icon size={18} className={stat.color} />
            </div>
            <span className="text-sm text-gray-500">{stat.label}</span>
          </div>
          <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
