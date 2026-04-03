import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Benefit, CreditCard, SpendingMultiplier } from "../types";
import { getCurrentPeriodKey } from "../lib/periods";

interface CardStore {
  cards: CreditCard[];

  addCard: (card: Omit<CreditCard, "id" | "multipliers" | "benefits">) => void;
  updateCard: (id: string, updates: Partial<CreditCard>) => void;
  deleteCard: (id: string) => void;

  setMultiplier: (cardId: string, multiplier: SpendingMultiplier) => void;
  removeMultiplier: (cardId: string, category: string) => void;

  addBenefit: (
    cardId: string,
    benefit: Omit<Benefit, "id" | "usageHistory">
  ) => void;
  updateBenefit: (
    cardId: string,
    benefitId: string,
    updates: Partial<Omit<Benefit, "id" | "usageHistory">>
  ) => void;
  deleteBenefit: (cardId: string, benefitId: string) => void;
  toggleBenefitUsed: (cardId: string, benefitId: string) => void;

  importData: (cards: CreditCard[]) => void;
}

export const useCardStore = create<CardStore>()(
  persist(
    (set) => ({
      cards: [],

      addCard: (card) =>
        set((state) => ({
          cards: [
            ...state.cards,
            { ...card, id: crypto.randomUUID(), multipliers: [], benefits: [] },
          ],
        })),

      updateCard: (id, updates) =>
        set((state) => ({
          cards: state.cards.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),

      deleteCard: (id) =>
        set((state) => ({
          cards: state.cards.filter((c) => c.id !== id),
        })),

      setMultiplier: (cardId, multiplier) =>
        set((state) => ({
          cards: state.cards.map((c) => {
            if (c.id !== cardId) return c;
            const existing = c.multipliers.findIndex(
              (m) =>
                m.category.toLowerCase() === multiplier.category.toLowerCase()
            );
            const multipliers = [...c.multipliers];
            if (existing >= 0) {
              multipliers[existing] = multiplier;
            } else {
              multipliers.push(multiplier);
            }
            return { ...c, multipliers };
          }),
        })),

      removeMultiplier: (cardId, category) =>
        set((state) => ({
          cards: state.cards.map((c) => {
            if (c.id !== cardId) return c;
            return {
              ...c,
              multipliers: c.multipliers.filter(
                (m) => m.category.toLowerCase() !== category.toLowerCase()
              ),
            };
          }),
        })),

      addBenefit: (cardId, benefit) =>
        set((state) => ({
          cards: state.cards.map((c) => {
            if (c.id !== cardId) return c;
            return {
              ...c,
              benefits: [
                ...c.benefits,
                { ...benefit, id: crypto.randomUUID(), usageHistory: [] },
              ],
            };
          }),
        })),

      updateBenefit: (cardId, benefitId, updates) =>
        set((state) => ({
          cards: state.cards.map((c) => {
            if (c.id !== cardId) return c;
            return {
              ...c,
              benefits: c.benefits.map((b) =>
                b.id === benefitId ? { ...b, ...updates } : b
              ),
            };
          }),
        })),

      deleteBenefit: (cardId, benefitId) =>
        set((state) => ({
          cards: state.cards.map((c) => {
            if (c.id !== cardId) return c;
            return {
              ...c,
              benefits: c.benefits.filter((b) => b.id !== benefitId),
            };
          }),
        })),

      toggleBenefitUsed: (cardId, benefitId) =>
        set((state) => ({
          cards: state.cards.map((c) => {
            if (c.id !== cardId) return c;
            return {
              ...c,
              benefits: c.benefits.map((b) => {
                if (b.id !== benefitId) return b;
                const currentKey = getCurrentPeriodKey(b.period);
                const existingIdx = b.usageHistory.findIndex(
                  (r) => r.periodKey === currentKey
                );
                const usageHistory = [...b.usageHistory];
                if (existingIdx >= 0) {
                  const existing = usageHistory[existingIdx]!;
                  usageHistory[existingIdx] = {
                    ...existing,
                    used: !existing.used,
                    usedDate: !existing.used
                      ? new Date().toISOString()
                      : undefined,
                  };
                } else {
                  usageHistory.push({
                    periodKey: currentKey,
                    used: true,
                    usedDate: new Date().toISOString(),
                  });
                }
                return { ...b, usageHistory };
              }),
            };
          }),
        })),

      importData: (cards) => set({ cards }),
    }),
    {
      name: "card-tracker-data",
      version: 1,
    }
  )
);
