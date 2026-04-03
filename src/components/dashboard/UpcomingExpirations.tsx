import { Clock } from "lucide-react";
import { Link } from "react-router-dom";
import type { CreditCard } from "../../types";
import { getUpcomingExpirations, getPeriodLabel } from "../../lib/periods";

interface UpcomingExpirationsProps {
  cards: CreditCard[];
}

export function UpcomingExpirations({ cards }: UpcomingExpirationsProps) {
  const expirations = getUpcomingExpirations(cards);

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-5 py-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <Clock size={18} className="text-gray-400" />
          Expiration Timeline
        </h2>
      </div>

      {expirations.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-gray-400">
          No upcoming expirations — all benefits are redeemed!
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-medium">Benefit</th>
                <th className="text-left px-5 py-3 font-medium">Card</th>
                <th className="text-left px-5 py-3 font-medium">Period</th>
                <th className="text-left px-5 py-3 font-medium">Value</th>
                <th className="text-left px-5 py-3 font-medium">Expires</th>
                <th className="text-left px-5 py-3 font-medium">
                  Days Left
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {expirations.map((item) => (
                <tr
                  key={`${item.cardId}-${item.benefitId}`}
                  className="text-sm"
                >
                  <td className="px-5 py-3 font-medium text-gray-800">
                    {item.benefitName}
                  </td>
                  <td className="px-5 py-3">
                    <Link
                      to={`/cards/${item.cardId}`}
                      className="text-gray-600 hover:text-indigo-600 flex items-center gap-2"
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: item.cardColor }}
                      />
                      {item.cardName}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-gray-500">
                    {getPeriodLabel(item.period)}
                  </td>
                  <td className="px-5 py-3 font-semibold text-green-600">
                    ${item.value}
                  </td>
                  <td className="px-5 py-3 text-gray-500">
                    {item.endDate.toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        item.daysRemaining <= 3
                          ? "bg-red-100 text-red-700"
                          : item.daysRemaining <= 7
                            ? "bg-amber-100 text-amber-700"
                            : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {item.daysRemaining} day{item.daysRemaining !== 1 ? "s" : ""}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
