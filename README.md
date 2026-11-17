# Noble_Step

A modern e-commerce platform for footwear built with React, Express, and MongoDB. Includes a responsive storefront, cart & checkout, JWT authentication, product reviews, order management, and an admin dashboard.

## Features

- **Storefront**: Product catalog with category/brand filtering, product details with image gallery, search with suggestions
- **Cart & Checkout**: Persistent cart, multi-step checkout with shipping/payment forms
- **Authentication**: JWT-based auth with register/login, protected routes, role-based access (user/admin)
- **Orders**: Order history, order details, order tracking (placeholder)
- **Reviews**: Submit and view product reviews with ratings
- **Admin Dashboard**: Manage products, orders, and users with CRUD operations
- **Responsive UI**: Tailwind CSS + Material UI components, dark/light theme

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, React Router 7, Tailwind CSS, Material UI, Lucide Icons |
| Backend | Express 5, MongoDB (Mongoose), JWT, bcryptjs |
| Security | Helmet, CORS, express-rate-limit, express-validator |
| Dev Tools | Create React App, nodemon, ESLint, Jest/React Testing Library |

## Project Structure

```
Nobles_Step/
├── backend/
│   ├── controllers/     # Route handlers (cart, order, product, review, user)
│   ├── middleware/      # Auth middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API route definitions
│   ├── server.js        # Entry point
│   └── package.json
└── frontend/
    ├── public/          # Static assets
    ├── src/
    │   ├── components/  # Reusable UI components
    │   ├── context/     # React contexts (cart, auth, products, etc.)
    │   ├── data/        # Static product data
    │   ├── modals/      # Modal components
    │   ├── pages/
    │   │   ├── admin/   # Admin dashboard pages
    │   │   └── user/    # Storefront pages
    │   ├── utils/       # API client
    │   ├── App.js       # Routes & providers
    │   └── index.js     # Entry point
    ├── tailwind.config.js
    └── package.json
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB instance (local or Atlas)

### Backend Setup
```bash
cd backend
cp .env.example .env   # Configure MONGODB_URI, JWT_SECRET, FRONTEND_URL, PORT
npm install
npm run dev            # Runs on http://localhost:5000
```

### Frontend Setup
```bash
cd frontend
cp .env.example .env   # Configure REACT_APP_API_URL
npm install
npm start              # Runs on http://localhost:3000
```

### Environment Variables

**Backend** (`.env`)
```
MONGODB_URI=mongodb://localhost:27017/noblestep
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
PORT=5000
NODE_ENV=development
```

**Frontend** (`.env`)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## API Endpoints

| Resource | Routes |
|----------|--------|
| Users | `POST /api/users/register`, `POST /api/users/login`, `GET /api/users/profile`, `PUT /api/users/profile` |
| Products | `GET /api/products`, `GET /api/products/:id`, `POST /api/products` (admin), `PUT /api/products/:id` (admin), `DELETE /api/products/:id` (admin) |
| Cart | `GET /api/cart`, `POST /api/cart`, `PUT /api/cart/:productId`, `DELETE /api/cart/:productId` |
| Orders | `GET /api/orders`, `GET /api/orders/:id`, `POST /api/orders`, `PUT /api/orders/:id/status` (admin) |
| Reviews | `GET /api/reviews/product/:productId`, `POST /api/reviews`, `PUT /api/reviews/:id`, `DELETE /api/reviews/:id` |

## Available Scripts

**Backend**
- `npm start` — Production server
- `npm run dev` — Development with nodemon

**Frontend**
- `npm start` — Dev server
- `npm run build` — Production build
- `npm test` — Run tests
- `npm run eject` — Eject CRA config (irreversible)

## Known Issues (from project review)

- RegisterModal syntax error (missing closing brace)
- Header logout uses `<Link>` instead of `<button>`
- Several non-functional buttons/links on HomePage, Footer, ContactPage
- ProductDetailsPage image gallery not implemented
- `onNavigate` prop missing from multiple pages
- Footer contains broken route links
- Order tracking and contact form are placeholders

See `frontend/PROJECT_REVIEW_REPORT.md` for full details.
