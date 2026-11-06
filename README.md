# 🎬 StudioSpace — Client Web Application

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Better Auth](https://img.shields.io/badge/Auth-Better_Auth-purple?style=for-the-badge)](https://www.better-auth.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployment-Vercel-000000?style=for-the-badge&logo=vercel)](https://fullstack-project1-studiospace-clie.vercel.app)

A modern full-stack web application designed for filmmakers, photographers, and audio engineers to discover, list, and book creative production spaces. Features zero-friction hourly reservations, collision-free slot protection, and token-verified host submissions.

## 🌐 Production Endpoints

- **Live Base URL:** `[https://fullstack-project1-studiospace-back.vercel.app](https://fullstack-project1-studiospace-back.vercel.app)`
- **Authorized Client URL:** `[https://fullstack-project1-studiospace-clie.vercel.app](https://fullstack-project1-studiospace-clie.vercel.app)`

---

## 🛡️ Security & Authentication Model

This API implements stateless cryptographic JWT token verification using the **`jose`** library:
- **JWKS Endpoint Integration:** Validates tokens asynchronously against the live client JWKS endpoint (`/api/auth/jwks`).
- **Cryptographic Signature Verification:** Eliminates shared symmetric secret vulnerabilities by relying on public RSA key pairs hosted by Better Auth.
- **Origin Whitelisting:** Strict CORS policy allowing only authorized domains with pre-flight header validation.

---

## 📡 REST API Reference

### 🟢 Public Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | API status and health check |
| `GET` | `/studios` | Fetch all listed studio workspaces with optional category filter |
| `GET` | `/studios/:id` | Fetch specific studio details, amenities, and hourly rates |
| `GET` | `/show-bookings?email=:email` | Retrieve confirmed and pending reservations for an account |

### 🔒 Protected Mutation Endpoints (Requires `Authorization: Bearer <token>`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/add-studio` | Validates host identity, sanitizes specs, and inserts new workspace record |
| `POST` | `/book-studio` | Validates booking collision algorithms and creates booking record |
| `PATCH` | `/my-bookings/:id/confirm` | Confirms booking reservation and locks time slot from collision pool |
| `DELETE` | `/my-bookings/:id` | Soft/hard cancels existing reservation and releases time slot |
| `DELETE` | `/studios/:id` | Host-initiated removal of published workspace listing |

---

## 📂 Backend Architecture

```plaintext
studiospace-server/
├── api/
│   └── index.js              # Serverless entry point for Vercel deployment
├── middlewares/
│   └── verifyToken.js        # Remote JWKS token extraction & validation
├── config/
│   └── db.js                 # MongoDB connection pool configuration
├── controllers/
│   ├── studioController.js   # Workspace CRUD handlers
│   └── bookingController.js  # Slot collision and reservation handlers
├── package.json
└── vercel.json               # Serverless route rewrites and CORS configs
```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/studiospace?retryWrites=true&w=majority
CLIENT_URL=https://fullstack-project1-studiospace-clie.vercel.app
NODE_ENV=production
```

---

## 💻 Local Setup & Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/limon-hasan/fullstack-project1-studiospace-backend.git
   cd fullstack-project1-studiospace-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   # or
   node index.js
   ```

4. Server will listen on `http://localhost:5000`.

---

## 👤 Author

- **Maksudul Hasan Limon** — Computer Science & Engineering Undergraduate
- GitHub: [@limon-hasan](https://github.com/limon-hasan)
