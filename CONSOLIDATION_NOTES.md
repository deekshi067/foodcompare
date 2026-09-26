# Consolidation Notes

This project was assembled from several uploaded sources on 2026-09-25.
Here's exactly what was kept, added, and dropped, and why.

## Source used as the base
`foodcompare__1_.zip` — the **MongoDB + Mongoose** backend. This was chosen
because it's the complete, working version: JWT auth, admin dashboard,
favorites (stored directly on the `User` model as an array of `FoodItem`
refs — no separate table needed), and a proper controller/route split.

## What was dropped, and why
- **`DOC-20260806-WA0007.zip`** — this looked like a newer snapshot of the
  same project, but it's actually a full **MySQL + Sequelize** rewrite of
  the backend (different `package.json`, Sequelize models, a `Favorite.js`
  join model, `schema.sql`). Since a project can only have one database
  layer, this was dropped entirely in favor of the MongoDB version.
- **A second, unrelated frontend config set** (an alternate `package.json`
  named `foodcompare-client` with `zod`, `recharts`, `react-hook-form`,
  a `/api` proxy to port 5000, and a different orange-toned Tailwind
  theme) — this didn't match either zip's actual `src/` code, so it looks
  like a leftover from a separate experiment. Dropped to avoid confusion.
- **Earlier seed data / route files generated in chat** (`food_items.json`,
  `restaurants.json`, `seed.js`, `foodRoutes.js`) — these assumed a
  multi-vendor "restaurantId per dish" schema. The real `FoodItem` model
  here is a **price-comparison** model instead (`swiggyPrice`,
  `zomatoPrice`, `offers`, redirect URLs, one `restaurant` ref per item).
  Those earlier files are **not compatible** with this schema and were
  intentionally left out rather than merged in.

## What was added
- **`frontend/.eslintrc.json`** — present in the loose uploads but missing
  from the zip's frontend folder.
- **`frontend/package-lock.json`** — confirmed it matches this exact
  frontend (`foodcompare-frontend`, same dependency versions), added for
  reproducible installs.

## Getting started
```bash
# Backend
cd backend
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, etc.
npm install
npm run seed            # loads demo restaurants/food items/users
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```
