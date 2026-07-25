# Slate Inventory

A modern inventory and point-of-sale workspace for a general store. The application includes an operational dashboard, product catalogue, POS cart and checkout, stock control, attendance, and business reports.

## Included

- Responsive overview with sales, profit, transactions, low-stock alerts, recent activity, and attendance
- Product search, filtering, catalogue table, and add-product workflow
- POS product browser, live cart, quantity controls, totals, and checkout receipt
- Inventory valuation, reorder status, stock levels, and adjustment entry points
- Staff attendance and payroll overview
- Sales, profit, inventory, and expense reports
- Durable D1-backed products, sales, sale items, staff, and stock-movement schema
- Cloudflare Worker-compatible deployment through Sites

## Local development

Requires Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Database and build

```bash
npm run db:generate
npm run build
```

Database migrations are stored in `drizzle/` and applied by the hosting platform. Runtime configuration lives in `.openai/hosting.json`.

## Architecture

- `app/` — UI and REST API routes
- `db/` — relational schema and database access
- `drizzle/` — generated migrations
- `worker/` — Cloudflare Worker entry
- `public/` — static assets and social preview
