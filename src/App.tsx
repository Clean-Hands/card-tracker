import { Routes, Route } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { Dashboard } from "./components/dashboard/Dashboard";
import { CardList } from "./components/cards/CardList";
import { CardDetail } from "./components/cards/CardDetail";

export default function App() {
	return (
		<AppShell>
			<Routes>
				<Route path="/" element={<Dashboard />} />
				<Route path="/cards" element={<CardList />} />
				<Route path="/cards/:id" element={<CardDetail />} />
			</Routes>
		</AppShell>
	);
}
