# 🍽️ FoodCompare

A full MERN-stack web app that lets users **compare food prices, ratings, and offers
across Swiggy and Zomato**, then redirects them to the real platform to place the
order. Built for learning — includes an admin dashboard, JWT auth, favorites, dark
mode, and sample/demo data (no scraping, no private APIs).

---

## 1. Project Structure

```
foodcompare/
├── backend/                     # Node.js + Express + MongoDB REST API
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── models/                  # Mongoose schemas
│   │   ├── User.js
│   │   ├── Restaurant.js
│   │   └── FoodItem.js
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT "protect" + "adminOnly"
│   │   ├── errorMiddleware.js   # 404 + centralized error handler
│   │   └── validateRequest.js   # express-validator result handler
│   ├── controllers/             # Business logic for each resource
│   │   ├── authController.js
│   │   ├── restaurantController.js
│   │   ├── foodItemController.js
│   │   ├── favoriteController.js
│   │   └── adminController.js
│   ├── routes/                  # URL -> controller mapping
│   │   ├── authRoutes.js
│   │   ├── restaurantRoutes.js
│   │   ├── foodItemRoutes.js
│   │   ├── favoriteRoutes.js
│   │   └── adminRoutes.js
│   ├── seed/
│   │   └── seedData.js          # Sample restaurants/food items + demo users
│   ├── .env.example
│   ├── package.json
│   └── server.js                # App entry point
│
└── frontend/                    # React (Vite) + Tailwind CSS
    ├── src/
    │   ├── api/
    │   │   └── axios.js         # Pre-configured Axios instance (JWT auto-attach)
    │   ├── context/
    │   │   ├── AuthContext.jsx  # Global login state
    │   │   └── ThemeContext.jsx # Global dark-mode state
    │   ├── components/          # Reusable UI pieces
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── RestaurantCard.jsx
    │   │   ├── FoodCard.jsx     # <-- the price comparison card
    │   │   ├── FavoriteButton.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── AdminRoute.jsx
    │   │   ├── Modal.jsx
    │   │   ├── AdminRestaurantForm.jsx
    │   │   ├── AdminFoodForm.jsx
    │   │   └── Loader.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── SearchResults.jsx
    │   │   ├── RestaurantDetails.jsx
    │   │   ├── FoodDetails.jsx
    │   │   ├── Favorites.jsx
    │   │   ├── Profile.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   └── NotFound.jsx
    │   ├── App.jsx               # All routes defined here
    │   ├── main.jsx              # React entry point
    │   └── index.css
    ├── index.html
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── vite.config.js
    ├── .env.example
    └── package.json
```

---

## 2. Architecture Diagram

```
┌─────────────────────┐        HTTPS / JSON        ┌──────────────────────────┐
│   React Frontend     │ ───────────────────────▶  │   Express REST API       │
│  (Vite, port 5173)   │ ◀───────────────────────  │   (Node.js, port 5000)   │
│                       │                            │                          │
│  Pages ─ Components   │                            │  Routes ─ Controllers    │
│  AuthContext (JWT)    │                            │  Middleware (JWT check)  │
│  ThemeContext (dark)  │                            │  Mongoose Models         │
└──────────┬────────────┘                            └────────────┬─────────────┘
           │                                                       │
           │ redirect on "Order Now"                               │ Mongoose ODM
           ▼                                                       ▼
 ┌───────────────────┐  ┌───────────────────┐          ┌────────────────────┐
 │   swiggy.com       │  │   zomato.com       │          │     MongoDB        │
 │ (external, opens   │  │ (external, opens   │          │  Users / Restaurants│
 │  in a new tab)      │  │  in a new tab)      │          │  / FoodItems        │
 └───────────────────┘  └───────────────────┘          └────────────────────┘
```

**Request flow example — searching for "pizza":**

1. User types in the Navbar search box → redirected to `/search?q=pizza`.
2. `SearchResults.jsx` calls `GET /api/food?search=pizza` and `GET /api/restaurants?search=pizza`.
3. Express routes the request to `foodItemController.getFoodItems`.
4. Mongoose runs a case-insensitive regex query against MongoDB and returns matches,
   with each item's restaurant **populated** in the same response.
5. React renders a `<FoodCard>` per item, showing Swiggy price vs Zomato price
   side-by-side, with the cheaper one highlighted.
6. Clicking **"Order Now"** opens `swiggyUrl` / `zomatoUrl` in a new browser tab —
   the app never processes payments or places orders itself.

---

## 3. Database Schema (MongoDB Collections)

```
User                          Restaurant                     FoodItem
─────────────────────         ─────────────────────          ──────────────────────
_id: ObjectId                 _id: ObjectId                  _id: ObjectId
name: String                  name: String                   name: String
email: String (unique)        image: String                  restaurant: ObjectId ──┐
password: String (hashed)     address: String                category: String       │
role: "user" | "admin"        rating: Number (0-5)            description: String    │
favorites: [ObjectId] ──┐     deliveryTime: String            image: String          │
createdAt / updatedAt    │    categories: [String]            swiggyPrice: Number    │
                          │    createdAt / updatedAt           zomatoPrice: Number    │
                          │                                    offers: {              │
                          │                                      swiggy: String,      │
                          └──────────────────▶ ref: FoodItem     zomato: String       │
                                                                }                     │
                                                                swiggyUrl: String     │
                                                                zomatoUrl: String     │
                                                                rating: Number         │
                                                                createdAt / updatedAt  │
                                                                                        │
                                                        (restaurant) ───────────────────┘
                                                        references Restaurant._id
```

- `User.favorites` is an array of `FoodItem` ObjectIds (many-to-many via reference).
- `FoodItem.restaurant` is a single `Restaurant` ObjectId (many-to-one).
- Passwords are hashed with **bcrypt** before saving (see `User.js` pre-save hook) —
  plain-text passwords are never stored.

---

## 4. REST API Reference

| Method | Endpoint                          | Access        | Description                          |
|--------|------------------------------------|---------------|---------------------------------------|
| POST   | `/api/auth/register`               | Public        | Create a new account                  |
| POST   | `/api/auth/login`                  | Public        | Log in, returns JWT                   |
| GET    | `/api/auth/profile`                | Private       | Get logged-in user's profile          |
| GET    | `/api/restaurants`                 | Public        | List/search/filter restaurants        |
| GET    | `/api/restaurants/:id`             | Public        | Restaurant details + its food items   |
| GET    | `/api/food`                        | Public        | List/search/filter/sort food items    |
| GET    | `/api/food/:id`                    | Public        | Single food item detail               |
| GET    | `/api/food/categories`             | Public        | Distinct list of categories           |
| GET    | `/api/favorites`                   | Private       | Logged-in user's favorites            |
| POST   | `/api/favorites/:foodItemId`       | Private       | Add a favorite                        |
| DELETE | `/api/favorites/:foodItemId`       | Private       | Remove a favorite                     |
| POST   | `/api/admin/restaurants`           | Admin         | Create a restaurant                   |
| PUT    | `/api/admin/restaurants/:id`       | Admin         | Update a restaurant                   |
| DELETE | `/api/admin/restaurants/:id`       | Admin         | Delete a restaurant                   |
| POST   | `/api/admin/food`                  | Admin         | Create a food item                    |
| PUT    | `/api/admin/food/:id`              | Admin         | Update a food item                    |
| DELETE | `/api/admin/food/:id`              | Admin         | Delete a food item                    |
| GET    | `/api/admin/users`                 | Admin         | List all users                        |
| PUT    | `/api/admin/users/:id/role`        | Admin         | Promote/demote a user                 |
| DELETE | `/api/admin/users/:id`             | Admin         | Delete a user                         |

`Private` routes require header: `Authorization: Bearer <token>`.

---

## 5. Local Setup (Step by Step)

### Prerequisites
- Node.js 18+ and npm
- MongoDB running locally, **or** a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### Step 1 — Backend

```bash
cd backend
npm install
cp .env.example .env
# open .env and set MONGO_URI + JWT_SECRET
npm run seed      # inserts sample restaurants/food items + demo logins
npm run dev        # starts the API on http://localhost:5000
```

Demo logins created by the seed script:
- Admin: `admin@foodcompare.com` / `admin123`
- User: `user@foodcompare.com` / `user1234`

### Step 2 — Frontend

Open a **second terminal**:

```bash
cd frontend
npm install
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api  (already set by default)
npm run dev         # starts the app on http://localhost:5173
```

Visit **http://localhost:5173** in your browser.

### Step 3 — Try it out
1. Browse the home page or search "pizza".
2. Click a food item to see the Swiggy vs Zomato price comparison.
3. Register/login, then click the ❤️ icon to save a favorite.
4. Log in as the seeded admin account and go to `/admin` to add/edit/delete
   restaurants, food items, prices, offers, and manage users.

---

## 6. How Each Core Feature Works

- **JWT Authentication**: On login/register, the backend signs a token containing
  the user's ID (`jsonwebtoken`). The frontend stores it in `localStorage` and
  Axios automatically attaches it as `Authorization: Bearer <token>` on every
  request (`src/api/axios.js`). Protected backend routes verify it with the
  `protect` middleware; admin-only routes additionally check `adminOnly`.
- **Password security**: Passwords are hashed with `bcryptjs` in a Mongoose
  `pre("save")` hook — never stored or transmitted in plain text after registration.
- **Price comparison**: Each `FoodItem` document stores both `swiggyPrice` and
  `zomatoPrice`. A Mongoose **virtual field**, `cheaperPlatform`, is computed on
  the fly and included in every API response, so the frontend doesn't need to
  duplicate that comparison logic.
- **Order Now redirect**: The `swiggyUrl` / `zomatoUrl` fields are plain external
  links opened with `target="_blank"` — the app never intercepts or processes the
  actual order.
- **Dark mode**: `ThemeContext` toggles a `dark` class on `<html>`; Tailwind's
  `darkMode: "class"` config makes every `dark:` utility class respond to it, and
  the choice is persisted in `localStorage`.
- **Favorites**: Stored as an array of `FoodItem` ObjectIds on the `User` document.
  Adding/removing just pushes/filters that array — no separate join table needed
  at this scale.

---

## 7. Deployment Guide

### Backend (Render / Railway / any Node host)
1. Push the `backend/` folder to a GitHub repo (or the whole monorepo).
2. Create a new **Web Service**, set the root directory to `backend`.
3. Build command: `npm install` — Start command: `npm start`.
4. Add environment variables from `.env.example` (use your production
   `MONGO_URI` from MongoDB Atlas and a strong random `JWT_SECRET`).
5. Set `CLIENT_URL` to your deployed frontend's URL (for CORS).

### Frontend (Vercel / Netlify)
1. Root directory: `frontend`.
2. Build command: `npm run build` — Output directory: `dist`.
3. Add environment variable `VITE_API_URL=https://your-backend-url.com/api`.
4. Deploy — Vercel/Netlify will give you a public URL.

### Database (MongoDB Atlas)
1. Create a free cluster at mongodb.com/atlas.
2. Add your deployed backend's IP (or `0.0.0.0/0` for simplicity in a demo)
   to the Atlas Network Access allow-list.
3. Copy the connection string into your backend's `MONGO_URI` environment variable.
4. Run `npm run seed` once (locally, pointed at the Atlas URI, or via a one-off
   Render/Railway shell) to populate sample data.

### Post-deploy checklist
- [ ] Visit `/api/health` on the backend URL — should return `{"status":"ok"}`
- [ ] Confirm CORS: frontend can call the backend without console errors
- [ ] Register a test account, log in, favorite an item
- [ ] Log in as admin and confirm you can add/edit/delete restaurants & food items

---

## 8. Notes on Data & Scope

- All restaurant/food/price/offer data is **sample data** entered via the seed
  script or the admin dashboard — this project does not scrape Swiggy/Zomato or
  call any private APIs, per the assignment requirements.
- "Order Now" only **redirects** the browser to the real platform; no payment or
  order-placement logic exists in this app.
