import { type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, CreditCard, Download, Upload } from "lucide-react";
import { useCardStore } from "../../store/useCardStore";

interface AppShellProps {
	children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
	const cards = useCardStore((s) => s.cards);
	const importData = useCardStore((s) => s.importData);

	const handleExport = () => {
		const data = JSON.stringify(cards, null, 2);
		const blob = new Blob([data], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `card-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
		a.click();
		URL.revokeObjectURL(url);
	};

	const handleImport = () => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = ".json";
		input.onchange = async () => {
			const file = input.files?.[0];
			if (!file) return;
			try {
				const text = await file.text();
				const data = JSON.parse(text);
				if (Array.isArray(data)) {
					importData(data);
				}
			} catch {
				alert("Invalid JSON file");
			}
		};
		input.click();
	};

	const linkClass = ({ isActive }: { isActive: boolean }) =>
		isActive ? "nav-link-active" : "nav-link";

	return (
		<div className="min-h-screen bg-gray-50 flex">
			<aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full">
				<div className="px-6 py-5 border-b border-gray-200">
					<h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
						<CreditCard size={24} className="text-indigo-600" />
						Card Tracker
					</h1>
				</div>

				<nav className="flex-1 px-3 py-4 space-y-1">
					<NavLink to="/" end className={linkClass}>
						<LayoutDashboard size={18} />
						Dashboard
					</NavLink>
					<NavLink to="/cards" className={linkClass}>
						<CreditCard size={18} />
						My Cards
					</NavLink>
				</nav>

				<div className="px-3 py-4 border-t border-gray-200 space-y-1">
					<button
						type="button"
						onClick={handleExport}
						className="nav-link w-full"
					>
						<Download size={18} />
						Export Data
					</button>
					<button
						type="button"
						onClick={handleImport}
						className="nav-link w-full"
					>
						<Upload size={18} />
						Import Data
					</button>
				</div>
			</aside>

			<main className="flex-1 ml-64 p-8">{children}</main>
		</div>
	);
}
