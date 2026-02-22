# 🛒 E-Commerce Store

A full-featured e-commerce storefront and admin dashboard built with **Next.js 16**, **React 19**, **Supabase**, and **Prisma**. Includes product browsing with advanced filtering, a real-time cart, a complete checkout flow with wilaya-based delivery, and a full admin panel for managing inventory, orders, and marketing.

> 🔗 **Live Demo:** [ecommerce-ILyes](https://ecommerce-ilyes.vercel.app/)


---

## ⚙️ Tech Stack

| Layer              | Technology                                               |
| ------------------ | -------------------------------------------------------- |
| **Framework**      | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| **Frontend**       | React 19, TypeScript                                     |
| **Styling**        | Tailwind CSS v4, Radix UI, Lucide Icons                  |
| **State Mgmt**     | Zustand                                                  |
| **Database**       | PostgreSQL (Supabase-hosted)                             |
| **ORM**            | Prisma                                                   |
| **Authentication** | Supabase Auth (Email/Password + OAuth)                   |
| **UI Components**  | shadcn/ui (Dialog, Sidebar, Slider, Dropdown…)           |
| **Carousel**       | Swiper.js                                                |
| **Notifications**  | Sonner (toast notifications)                             |
| **Theming**        | next-themes (dark/light mode)                            |

---

## ✨ Core E-commerce Features

### 🛍️ User Experience

- **Product Search** — Full-text search with real-time results via Prisma `contains` queries.
- **Filtering & Sorting** — Filter products by price range and brand, sort by price ascending/descending.
- **Category Browsing** — Hierarchical categories with subcategories, each with dedicated pages.
- **Product Details** — Multi-image galleries, product variants (color, size, unit), compare-at prices, and detailed descriptions.
- **Wishlist** — Authenticated users can save products to a personal wishlist.
- **Trending Products** — Admin-curated trending section on the homepage.
- **Responsive Design** — Fully mobile-friendly with dedicated mobile header, navigation menu, and search.

### 🛒 Cart & Checkout

- **Persistent Cart** — Cart state managed with **Zustand** on the client and synced to the database via Prisma for authenticated users. Supports guest carts.
- **Real-time Updates** — Increase/decrease item quantities or remove items, with instant UI feedback and server sync.
- **Checkout Form** — Collects customer name, email, phone, and delivery wilaya. Auto-populates fields for logged-in users.
- **Wilaya-based Delivery** — Delivery fees calculated based on the selected Algerian wilaya (province).
- **Order Confirmation** — Success dialog with order summary after successful placement.

### 📊 Admin Dashboard

- **Dashboard Overview** — At-a-glance view of recent orders and key metrics.
- **Products Management** — Full CRUD for products, variants (price, color, size, stock), and product images.
- **Categories & Brands** — Create and manage product categories (with subcategories) and brands.
- **Stock Tracking** — Monitor and update inventory levels per product variant, with low-stock alerts.
- **Order Management** — View all orders with status tracking (Pending → Processing → Shipped → Cancelled).
- **Carousel Management** — Configure the homepage hero carousel slides (image, title, link).
- **Trending Curation** — Mark products as trending to feature them on the homepage.
- **Wilaya & Delivery** — Manage delivery zones and pricing per wilaya.
- **Collapsible Sidebar** — Clean admin layout with a sidebar built on shadcn/ui `SidebarProvider`.

### 🔐 Security & Authentication

- **Supabase Auth** — Email/password registration with email confirmation, plus OAuth providers (Google, GitHub, etc.).
- **Password Recovery** — Full forgot-password → email link → update-password flow.
- **Role-based Access** — `USER` and `ADMIN` roles defined at the database level. Admin routes are protected.
- **Middleware Protection** — Supabase SSR middleware refreshes auth sessions and guards protected routes.
- **Server Actions** — All data mutations (cart, orders, admin operations) go through Next.js Server Actions, keeping secrets server-side.

---

## 🚀 Local Setup

### Prerequisites

- **Node.js** ≥ 18
- **npm** (or yarn/pnpm)
- A **Supabase** project ([create one free](https://supabase.com))
- **PostgreSQL** database (provided by Supabase, or run locally)

### 1. Clone & Install

```bash
git clone https://github.com/ILyes-SS/e-commerce.git
cd e-commerce
npm install
```

### 2. Environment Variables

Create a `.env` file in the project root. Use the template below and fill in your own values:

```env
# ─── Database (Supabase PostgreSQL) ───────────────────────────
DATABASE_URL="postgresql://<user>:<password>@<host>:5432/<db>?pgbouncer=true"
DIRECT_URL="postgresql://<user>:<password>@<host>:5432/<db>"

# ─── Supabase Auth ────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

> [!IMPORTANT]
> Never commit your `.env` file. The `.gitignore` already excludes it.

### 3. Database Setup

Generate the Prisma client and push the schema to your database:

```bash
npx prisma generate
npx prisma db push
```

To explore your data visually:

```bash
npx prisma studio
```

### 4. Seed the Database (Manual)

There is no automated seed script yet. To populate the store with sample data, use **Prisma Studio** (`npx prisma studio`) or the **Admin Dashboard** after starting the app:

1. Start the dev server (see below).
2. Create an account and set its role to `ADMIN` in the database.
3. Use the admin panel at `/dashboard` to add categories, brands, products, variants, and set delivery wilayas.

### 5. Run the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the storefront.

---

## 🧪 Testing & Usage

### Demo Credentials

| Role      | Email                    | Password       |
| --------- | ------------------------ | -------------- |
| **Admin** | `admin@test.com`      | `admin1234`    |

> [!NOTE]
> These are sample credentials. After setting up locally, create your own users via the sign-up page and manually assign the `ADMIN` role in the database or via Prisma Studio.

### Key Routes

| Route                    | Description                          |
| ------------------------ | ------------------------------------ |
| `/`                      | Homepage — carousel, trending, categories |
| `/search?q=...`          | Search results with filters          |
| `/<category>`            | Category product listing             |
| `/product/<slug>`        | Product detail page                  |
| `/checkout`              | Checkout form                        |
| `/auth/login`            | Sign in                              |
| `/auth/sign-up`          | Create account                       |
| `/auth/forgot-password`  | Password recovery                    |
| `/history`               | Order history (authenticated)        |
| `/dashboard`             | Admin dashboard overview             |
| `/products-management`   | Admin product/category/brand CRUD    |
| `/orders`                | Admin order management               |
| `/stock`                 | Admin stock tracking                 |

---

## 📁 Project Structure

```
e-commerce/
├── app/
│   ├── (main)/          # Storefront: home, search, product, checkout, categories
│   ├── (admin)/         # Admin panel: dashboard, products, orders, stock
│   └── (auth)/          # Auth flows: login, sign-up, password reset, OAuth
├── actions/             # Next.js Server Actions (cart, orders, stock)
│   └── admin/           # Admin-specific actions (products, categories, brands…)
├── components/          # Reusable UI components
│   ├── ui/              # shadcn/ui primitives
│   └── admin/           # Admin-specific components
├── store/               # Zustand stores (cart state)
├── prisma/              # Prisma schema & migrations
├── lib/                 # Utilities, Prisma client, Supabase helpers
├── hooks/               # Custom React hooks
├── types.ts             # Shared TypeScript types
└── public/              # Static assets
```

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).
