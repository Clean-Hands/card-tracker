import { useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { useCardStore } from "../../store/useCardStore";
import { DEFAULT_CATEGORIES } from "../../data/defaultCategories";
import { getPeriodShortLabel } from "../../lib/periods";
import type { CapPeriod, SpendingMultiplier } from "../../types";

interface MultiplierTableProps {
	cardId: string;
	multipliers: SpendingMultiplier[];
}

export function MultiplierTable({ cardId, multipliers }: MultiplierTableProps) {
	const setMultiplier = useCardStore((s) => s.setMultiplier);
	const removeMultiplier = useCardStore((s) => s.removeMultiplier);

	const [adding, setAdding] = useState(false);
	const [newCategory, setNewCategory] = useState("");
	const [customCategory, setCustomCategory] = useState("");
	const [newMultiplier, setNewMultiplier] = useState("1");
	const [newNotes, setNewNotes] = useState("");
	const [newCap, setNewCap] = useState("");
	const [newCapPeriod, setNewCapPeriod] = useState<CapPeriod>("annual");

	const [editingCategory, setEditingCategory] = useState<string | null>(null);
	const [editMultiplier, setEditMultiplier] = useState("1");
	const [editNotes, setEditNotes] = useState("");
	const [editCap, setEditCap] = useState("");
	const [editCapPeriod, setEditCapPeriod] = useState<CapPeriod>("annual");

	const existingCategories = new Set(
		multipliers.map((m) => m.category.toLowerCase())
	);
	const availableCategories = DEFAULT_CATEGORIES.filter(
		(c) => !existingCategories.has(c.toLowerCase())
	);

	const handleAdd = () => {
		if (newCategory === "__custom") {
			if (!customCategory.trim()) return;
			const capVal = Number(newCap) || undefined;
			setMultiplier(cardId, {
				category: customCategory.trim(),
				multiplier: Number(newMultiplier) || 1,
				notes: newNotes.trim() || undefined,
				capAmount: capVal,
				capPeriod: capVal ? newCapPeriod : undefined,
			});
		} else {
			if (!newCategory.trim()) return;
			const capVal = Number(newCap) || undefined;
			setMultiplier(cardId, {
				category: newCategory.trim(),
				multiplier: Number(newMultiplier) || 1,
				notes: newNotes.trim() || undefined,
				capAmount: capVal,
				capPeriod: capVal ? newCapPeriod : undefined,
			});
		}
		setNewCategory("");
		setCustomCategory("");
		setNewMultiplier("1");
		setNewNotes("");
		setNewCap("");
		setNewCapPeriod("annual");
		setAdding(false);
	};

	const startEdit = (m: SpendingMultiplier) => {
		setEditingCategory(m.category);
		setEditMultiplier(String(m.multiplier));
		setEditNotes(m.notes ?? "");
		setEditCap(m.capAmount ? String(m.capAmount) : "");
		setEditCapPeriod(m.capPeriod ?? "annual");
	};

	const saveEdit = (category: string) => {
		const capVal = Number(editCap) || undefined;
		setMultiplier(cardId, {
			category,
			multiplier: Number(editMultiplier) || 1,
			notes: editNotes.trim() || undefined,
			capAmount: capVal,
			capPeriod: capVal ? editCapPeriod : undefined,
		});
		setEditingCategory(null);
	};

	return (
		<div className="card">
			<div className="card-header flex items-center justify-between">
				<h2 className="font-semibold text-gray-900">Spending Multipliers</h2>
				<button
					type="button"
					onClick={() => setAdding(true)}
					className="btn-link-sm"
				>
					<Plus size={16} />
					Add
				</button>
			</div>

			<div className="divide-y divide-gray-100">
				{multipliers.length === 0 && !adding && (
					<p className="px-5 py-8 text-center text-gray-400 text-sm">
						No multipliers set. Add categories to track which spending earns the
						most rewards.
					</p>
				)}

				{multipliers.map((m) => (
					<div key={m.category} className="px-5 py-3">
						{editingCategory === m.category ? (
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<span className="text-sm font-medium text-gray-700 min-w-[120px]">
										{m.category}
									</span>
									<input
										type="number"
										value={editMultiplier}
										onChange={(e) => setEditMultiplier(e.target.value)}
										min="0.5"
										step="0.5"
										className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
										placeholder="1x"
									/>
									<span className="text-sm text-gray-500">x</span>
									<button
										type="button"
										onClick={() => saveEdit(m.category)}
										className="p-1 text-green-600 hover:bg-green-50 rounded"
									>
										<Save size={14} />
									</button>
									<button
										type="button"
										onClick={() => setEditingCategory(null)}
										className="btn-secondary px-2 py-1 text-xs"
									>
										Cancel
									</button>
								</div>
								<input
									type="text"
									value={editNotes}
									onChange={(e) => setEditNotes(e.target.value)}
									placeholder="Notes (optional)"
									className="form-input"
								/>
								<div className="flex gap-2">
									<input
										type="number"
										value={editCap}
										onChange={(e) => setEditCap(e.target.value)}
										placeholder="Cap $ (optional)"
										className="form-input !w-auto flex-1"
									/>
									<select
										value={editCapPeriod}
										onChange={(e) => setEditCapPeriod(e.target.value as CapPeriod)}
										className="form-input !w-auto"
									>
										<option value="monthly">per month</option>
										<option value="quarterly">per quarter</option>
										<option value="semi-annual">per 6 months</option>
										<option value="annual">per year</option>
									</select>
								</div>
							</div>
						) : (
							<div className="flex items-center justify-between">
								<div
									className="flex-1 cursor-pointer"
									onClick={() => startEdit(m)}
								>
									<div className="flex items-center gap-3">
										<span className="text-sm text-gray-700">{m.category}</span>
										<span className="text-sm font-bold text-indigo-600">
											{m.multiplier}x
										</span>
										{m.capAmount && (
											<span className="text-xs text-gray-400">
												(cap: ${m.capAmount.toLocaleString()}{getPeriodShortLabel(m.capPeriod ?? "annual")})
											</span>
										)}
									</div>
									{m.notes && (
										<p className="text-xs text-gray-400 mt-0.5">{m.notes}</p>
									)}
								</div>
								<button
									type="button"
									onClick={() => removeMultiplier(cardId, m.category)}
									className="btn-icon-delete"
								>
									<Trash2 size={14} />
								</button>
							</div>
						)}
					</div>
				))}

				{adding && (
					<div className="px-5 py-3 space-y-2 bg-gray-50">
						<div className="flex items-center gap-2">
							<select
								value={newCategory}
								onChange={(e) => setNewCategory(e.target.value)}
								className="form-input !w-auto flex-1"
							>
								<option value="">Select category...</option>
								{availableCategories.map((c) => (
									<option key={c} value={c}>
										{c}
									</option>
								))}
								<option value="__custom">Custom...</option>
							</select>
							<input
								type="number"
								value={newMultiplier}
								onChange={(e) => setNewMultiplier(e.target.value)}
								min="0.5"
								step="0.5"
								className="w-20 px-2 py-1.5 border border-gray-300 rounded text-sm"
							/>
							<span className="text-sm text-gray-500">x</span>
						</div>
						{newCategory === "__custom" && (
							<input
								type="text"
								value={customCategory}
								onChange={(e) => setCustomCategory(e.target.value)}
								placeholder="Type custom category name..."
								className="form-input"
								autoFocus
							/>
						)}
						<input
							type="text"
							value={newNotes}
							onChange={(e) => setNewNotes(e.target.value)}
							placeholder="Notes (optional, e.g., 'enrolled quarterly categories')"
							className="form-input"
						/>
						<div className="flex gap-2">
							<input
								type="number"
								value={newCap}
								onChange={(e) => setNewCap(e.target.value)}
								placeholder="Cap $ (optional)"
								className="form-input !w-auto flex-1"
							/>
							<select
								value={newCapPeriod}
								onChange={(e) => setNewCapPeriod(e.target.value as CapPeriod)}
								className="form-input !w-auto"
							>
								<option value="monthly">per month</option>
								<option value="quarterly">per quarter</option>
								<option value="semi-annual">per 6 months</option>
								<option value="annual">per year</option>
							</select>
						</div>
						<div className="flex gap-2 justify-end">
							<button
								type="button"
								onClick={() => setAdding(false)}
								className="btn-secondary"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={handleAdd}
								className="btn-primary"
							>
								Add
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
