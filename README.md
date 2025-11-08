# Cart_mamanger

Minimal full-stack mock e-commerce cart app (for a coding assignment).

Getting started

This repository contains a small full-stack shopping cart demo built with React (Vite) frontend and a Node/Express backend using MongoDB (Mongoose).

Quick summary
- Frontend: `frontend/` — Vite + React + simple components (product grid, cart, checkout)
- Backend: `backend/` — Express API that stores data in MongoDB (Mongoose models)

Features
- Product listing (seeded defaults)
- Create product (admin-like endpoint)
- Per-user carts (scoped by `x-user-id` header; frontend generates a persistent local session id)
- Add/update/remove cart items
- Mock checkout producing receipts saved to the DB (with timestamp)
- Offline-friendly: frontend shows default products when backend is unavailable

Prerequisites
- Node.js (>= 18 recommended)
- npm
- MongoDB (Atlas or local)

Environment
- Copy `backend/.env.example` → `backend/.env` and set `MONGO_URI` (Atlas connection string or local Mongo URI).

Important env values
- `MONGO_URI` — MongoDB connection string, e.g. `mongodb://localhost:27017/cart_manager` or an Atlas URI. The app uses this to connect on startup.

Run locally (bash)

1) Backend

```bash
cd backend
npm install
# create backend/.env from backend/.env.example and set MONGO_URI
npm run dev
```

2) Frontend

```bash
cd frontend
npm install
npm run dev
# open the Vite URL shown in the terminal (e.g. http://localhost:5173)
```

Run locally (PowerShell)

```powershell
1. Start backend (MongoDB)
   cd Cart_mamanger/backend
   npm install
   # create a .env file with MONGO_URI if you want a remote DB
   npm run dev

2. Start frontend
   cd Cart_mamanger/frontend
   npm install
   npm run dev


If the backend uses a port other than `4000`, set the frontend env `VITE_API_BASE` (create `frontend/.env` with `VITE_API_BASE=http://localhost:<PORT>`).

API Endpoints

All backend endpoints are served under `/api`.

- GET /api/products
   - Returns list of products: [{ id, name, price }]

- POST /api/products
   - Create a product. Body: { name, price }
   - Response: 201 with created product { id, name, price }

- GET /api/cart
   - Get cart for the current user. Requires header `x-user-id` or query `?userId=`.
   - Response: { items: [{ id, productId, name, price, qty, lineTotal }], total }

- POST /api/cart
   - Add/update cart item. Body: { productId, qty }. Requires `x-user-id` header.

- DELETE /api/cart/:id
   - Remove a cart item by cart entry id. Requires `x-user-id` header.

- POST /api/cart/checkout
   - Checkout: Body: { cartItems: [{ productId, qty }], meta?: { name, email } }. Requires `x-user-id` header.
   - Response contains `receipt` with `timestamp`.

Example curl (bash)

```bash
# list products
curl http://localhost:4000/api/products

# create product
curl -X POST http://localhost:4000/api/products -H 'Content-Type: application/json' -d '{"name":"Demo","price":12.5}'

# add to cart (replace PRODUCT_ID and provide user id)
curl -X POST http://localhost:4000/api/cart -H 'Content-Type: application/json' -H 'x-user-id: demo-user' -d '{"productId":"<PRODUCT_ID>","qty":2}'

# checkout
curl -X POST http://localhost:4000/api/cart/checkout -H 'Content-Type: application/json' -H 'x-user-id: demo-user' -d '{"cartItems":[{"productId":"<PRODUCT_ID>","qty":2}],"meta":{"name":"You","email":"you@domain.com"}}'
```

Notes & Troubleshooting

- Backend connection refused (frontend shows `ERR_CONNECTION_REFUSED`): the frontend couldn't reach `http://localhost:4000`. Make sure the backend is running (`npm run dev`) and listening on port 4000. If another process uses port 4000, either stop it or start the backend on a different port by setting `PORT`.

- MongoDB Atlas DNS/SRV errors (e.g. `querySrv EREFUSED`): this typically indicates DNS resolution or network issues connecting to Atlas. Steps to fix:
   - Ensure your machine can resolve SRV records (some networks/ISPs block DNS SRV lookups).
   - In Atlas, add your IP (or 0.0.0.0/0 for testing) under Network Access so the cluster accepts connections from your IP.
   - Verify credentials and the `MONGO_URI` string in `backend/.env`.

- Port in use error (EADDRINUSE): find the process using the port and stop it (PowerShell: `Get-NetTCPConnection -LocalPort 4000` then `Stop-Process -Id <PID>`), or run the backend on a different port: `PORT=5001 npm run dev` (bash) or `$env:PORT=5001; npm run dev` (PowerShell).

Offline/demo mode
- The frontend provides default products when the backend is unavailable so the UI remains useful for design and testing. Note: cart writes still attempt to call the backend unless you enable the offline cart fallback.

Per-user carts
- Cart endpoints require a `x-user-id` header (frontend sets a persistent id in `localStorage` automatically). This keeps carts separate per session/user.

Testing
- Backend tests (Jest + Supertest) are in `backend/__tests__`. They connect to the configured `MONGO_URI` — use a test database when running tests to avoid polluting production data.

Recommended next steps
- If you encounter Atlas connection errors, either run a local MongoDB instance (`mongod`) and set `MONGO_URI=mongodb://localhost:27017/cart_manager` in `backend/.env`, or open Atlas network access and ensure SRV DNS is resolvable.
- Add a `frontend/.env` with `VITE_API_BASE` if your backend is on a custom host or port.

Contributing
- Open a PR with a clear description. Tests live under `backend/__tests__`.

License
- MIT
Notes
- Backend runs on port 4000 by default. Frontend expects API at http://localhost:4000.
- This is a minimal starter to satisfy the assignment requirements: products grid, cart, checkout (mock).
