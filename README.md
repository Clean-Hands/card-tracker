# Card Tracker

A webapp for tracking credit card spending category multipliers, benefits, and credits to maximize the value you get from every card in your wallet.

## Features

- **Spending Multipliers** — Track per-category multiplier rates (e.g. 5x Groceries, 3x Dining) with optional spend caps and cap periods (monthly/quarterly/semi-annual/annual)
- **Benefit Tracking** — Track credits and perks with monthly, quarterly, semi-annual, or annual expiration cycles. Mark benefits as redeemed each period so nothing goes to waste
- **Best Card Lookup** — Instantly see which card earns the most for any spending category, ranked by effective value (multiplier x point valuation)
- **Point Valuations** — Assign cents-per-point values and reward currency names (e.g. SkyMiles at 1.2cpp) to factor into rankings
- **Dashboard** — At-a-glance view of total annual fees, potential value, redeemed value, net value, and unused benefits
- **Expiration Timeline** — See upcoming benefit expirations sorted by days remaining
- **Unused Benefits Alert** — Get warned about benefits you haven't redeemed in the current period
- **Export/Import** — Backup and restore your card data as JSON
- **Color Picker** — Assign custom colors to each card for easy visual identification

## Tech Stack

- **React 19** + **TypeScript**
- **Vite 6** for dev server and builds
- **Tailwind CSS 4** for styling
- **Zustand 5** with `persist` middleware for localStorage state management
- **React Router v7** for client-side routing
- **Lucide React** for icons

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
  components/
    cards/         # Card list, detail, and form
    benefits/      # Benefit list, card, and form
    multipliers/   # Multiplier table with inline editing
    dashboard/     # Dashboard, value summary, best card lookup, expirations
    layout/        # App shell with sidebar navigation
    ui/            # Shared UI components (modal)
  store/           # Zustand store (cards, multipliers, benefits)
  lib/             # Business logic (periods, best card ranking, value calculations)
  types/           # TypeScript type definitions
  data/            # Default categories and card colors
```
