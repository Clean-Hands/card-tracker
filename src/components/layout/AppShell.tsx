import { useState, type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import {
	LayoutDashboard,
	CreditCard,
	Download,
	Upload,
	Menu,
	X,
} from "lucide-react";
import { useCardStore } from "../../store/useCardStore";

interface AppShellProps {
	children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
	const cards = useCardStore((s) => s.cards);
	const importData = useCardStore((s) => s.importData);
	const [sidebarOpen, setSidebarOpen] = useState(false);

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

	const closeSidebar = () => setSidebarOpen(false);

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Mobile top bar */}
			<header className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 flex items-center gap-3 px-4 h-14">
				<button
					type="button"
					title="Open menu"
					onClick={() => setSidebarOpen(true)}
					className="p-2 -ml-2 text-gray-600 rounded-md hover:bg-gray-100"
				>
					<Menu size={22} />
				</button>
				<h1 className="font-bold text-gray-900 flex items-center gap-2">
					<CreditCard size={20} className="text-indigo-600" />
					Card Tracker
				</h1>
			</header>

			{/* Backdrop */}
			{sidebarOpen && (
				<div
					className="md:hidden fixed inset-0 z-40 bg-black/50"
					onClick={closeSidebar}
				/>
			)}

			{/* Sidebar */}
			<aside
				className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-200 md:translate-x-0 ${
					sidebarOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
					<h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
						<CreditCard size={24} className="text-indigo-600" />
						Card Tracker
					</h1>
					<button
						type="button"
						title="Close menu"
						onClick={closeSidebar}
						className="md:hidden p-1 text-gray-500 rounded-md hover:bg-gray-100"
					>
						<X size={20} />
					</button>
				</div>

				<nav className="flex-1 px-3 py-4 space-y-1">
					<NavLink to="/" end className={linkClass} onClick={closeSidebar}>
						<LayoutDashboard size={18} />
						Dashboard
					</NavLink>
					<NavLink to="/cards" className={linkClass} onClick={closeSidebar}>
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

			<main className="md:ml-64 p-4 md:p-8 pt-20 md:pt-8">{children}</main>
		</div>
	);
}
