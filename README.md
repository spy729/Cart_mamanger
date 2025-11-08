# Cart_mamanger

Minimal full-stack mock e-commerce cart app (for a coding assignment).

Structure
- `backend/` — Node/Express API with LowDB persistence
- `frontend/` — Vite + React UI
Note: backend now supports MongoDB via Mongoose. By default it will try to connect to `mongodb://localhost:27017/cart_manager`.
Set `MONGO_URI` in `backend/.env` to change the connection string.

APIs implemented
- GET /api/products
- POST /api/cart
- DELETE /api/cart/:id
- GET /api/cart
- POST /api/checkout

Run
1. Start backend (MongoDB)
   cd Cart_mamanger/backend
   npm install
   # create a .env file with MONGO_URI if you want a remote DB
   npm run dev

2. Start frontend
   cd Cart_mamanger/frontend
   npm install
   npm run dev

Notes
- Backend runs on port 4000 by default. Frontend expects API at http://localhost:4000.
- This is a minimal starter to satisfy the assignment requirements: products grid, cart, checkout (mock).
