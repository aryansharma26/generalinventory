# Slate Inventory

Slate Inventory is organized as two independent applications:

```text
generalInventory/
├── frontend/             React + Vite + TypeScript
│   ├── src/
│   │   ├── App.tsx
│   │   ├── api.ts
│   │   ├── index.css
│   │   └── main.tsx
│   ├── public/
│   ├── Dockerfile
│   └── package.json
├── backend/              Node.js + Express + TypeScript
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```

The legacy root Vinext files remain only as the adapter for the already-published Sites preview. New development should happen inside `frontend/` and `backend/`.

## Local setup

Requirements: Node.js 22+, npm, and PostgreSQL.

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

The API runs at `http://localhost:4000`. Health check: `GET /api/health`.

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The app runs at `http://localhost:3000` and uses `VITE_API_URL` to reach the backend.

## Docker

To start PostgreSQL, backend, and frontend together:

```bash
docker compose up --build
```

Open `http://localhost:8080`.

## Production builds

```bash
cd backend && npm run build
cd ../frontend && npm run build
```

The backend uses PostgreSQL through Prisma and separates validation, controllers, services, and repositories. The frontend is a standalone SPA and has no backend framework dependency.
