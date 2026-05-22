# 🚗 DriveEase — Car Rental Management System

A secure, full-stack Car Rental Management System built with **Next.js 14**, **MongoDB**, **Tailwind CSS**, and **JWT authentication**.

---

## 📁 Project Structure

```
Car Rental Management System/
├── admin/          ← Secure Admin Panel + Backend API (port 3001)
└── website/        ← Public-facing Website (port 3000)
```

Both apps share the same MongoDB database and communicate via REST API calls.

---

## 🛡️ Security Architecture

| Concern | Mitigation |
|---|---|
| Authentication | JWT stored in `HttpOnly; Secure; SameSite=Strict` cookies (XSS-safe) |
| Password Storage | `bcryptjs` with 12 salt rounds |
| Input Validation | `zod` schema validation on all API endpoints before DB operations |
| Route Protection | Next.js `middleware.ts` guards all `/dashboard/*` server-side |
| Injection Prevention | Mongoose strict schemas reject all extra fields |
| Admin Isolation | Completely separate Next.js app on a different port |
| CORS | API only allows requests from the configured website origin |
| Security Headers | `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection` on all API routes |

---

## ⚙️ Prerequisites

- **Node.js** v18+ (v20 recommended)
- **npm** v9+
- **MongoDB** running locally on `localhost:27017` OR a MongoDB Atlas connection string

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd "Car Rental Management System"
```

### 2. Configure Environment Variables

**Admin Panel** (`admin/.env.local`):
```env
MONGODB_URI=mongodb://localhost:27017/car_rental
JWT_SECRET=your_super_secret_jwt_key_change_in_production_min_32_chars
ADMIN_EMAIL=admin@carrental.com
ADMIN_PASSWORD=Admin@123!
WEBSITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Website** (`website/.env.local`):
```env
NEXT_PUBLIC_ADMIN_API_URL=http://localhost:3001
```

> ⚠️ **IMPORTANT**: Change `JWT_SECRET` to a cryptographically random 32+ character string before deploying to production.

### 3. Install Dependencies

```bash
# Admin panel dependencies
cd admin
npm install

# Website dependencies
cd ../website
npm install
```

### 4. Seed the Admin User

From the `admin/` directory:

```bash
cd admin
npx ts-node --project tsconfig.json scripts/seed.ts
```

This creates the first admin account using the credentials in `.env.local`.

### 5. Start Both Servers

Open **two terminal windows**:

**Terminal 1 — Admin Panel (port 3001):**
```bash
cd admin
npm run dev
```

**Terminal 2 — Website (port 3000):**
```bash
cd website
npm run dev
```

---

## 🌐 Application URLs

| App | URL | Description |
|---|---|---|
| Public Website | [http://localhost:3000](http://localhost:3000) | Customer-facing pages |
| Admin Login | [http://localhost:3001/login](http://localhost:3001/login) | Admin authentication |
| Admin Dashboard | [http://localhost:3001/dashboard](http://localhost:3001/dashboard) | Booking management |

---

## 📄 Website Pages

| Page | Route |
|---|---|
| Home | `/` |
| About Us | `/about` |
| Our Fleet | `/vehicles` |
| Book a Car | `/booking` |
| Contact | `/contact` |

---

## 🔐 Admin Panel Features

- **Secure Login** — JWT cookie-based authentication
- **Dashboard** — Stats overview (total, new, read, resolved bookings)
- **Booking Table** — View all customer submissions with full details
- **Delete Records** — Safely remove booking records with inline confirmation
- **Auto Redirect** — Unauthenticated users are redirected to login page

---

## 🗄️ MongoDB Collections

### `adminusers`
```typescript
{
  email: String (unique, lowercase),
  password: String (bcrypt hashed, 12 rounds),
  createdAt: Date,
  updatedAt: Date
}
```

### `contactmessages`
```typescript
{
  fullName: String,
  email: String,
  phone: String,
  vehicleType: Enum ['economy','compact','midsize','suv','luxury','van','truck','sports'],
  pickupDate: String,
  returnDate: String,
  message: String (optional, max 1000 chars),
  status: Enum ['new','read','resolved'] (default: 'new'),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API Endpoints

All API routes are served from the **Admin app** at `http://localhost:3001`.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Admin login (returns JWT cookie) |
| `POST` | `/api/auth/logout` | Public | Clears JWT cookie |
| `GET` | `/api/auth/me` | 🔒 | Returns current session |
| `GET` | `/api/messages` | 🔒 | List all booking records (paginated) |
| `POST` | `/api/messages` | Public | Submit booking form (from website) |
| `GET` | `/api/messages/:id` | 🔒 | Get single booking record |
| `DELETE` | `/api/messages/:id` | 🔒 | Delete a booking record |

---

## 🔒 Default Admin Credentials

> Set via `.env.local` before running the seed script.

```
Email:    admin@carrental.com
Password: Admin@123!
```

**Change these immediately in a production environment.**

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS v4 |
| Backend | Next.js API Routes |
| Database | MongoDB + Mongoose ODM |
| Authentication | JWT (via `jose`) + HttpOnly Cookies |
| Validation | `zod` schemas |
| Password Hashing | `bcryptjs` (12 rounds) |
| Icons | `lucide-react` |

---

## 🚢 Production Deployment Notes

1. Set `NODE_ENV=production` — this enables `Secure` flag on cookies
2. Use a strong `JWT_SECRET` (minimum 32 random characters)
3. Replace `MONGODB_URI` with your MongoDB Atlas connection string
4. Set `WEBSITE_URL` to your actual deployed website domain for CORS
5. Deploy both apps to separate services (e.g., Vercel projects)

---

## 📝 License

This project is for educational and portfolio purposes.
