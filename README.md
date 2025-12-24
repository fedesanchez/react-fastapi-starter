# React + FastAPI starter template

A boilerplate featuring a **FastAPI** backend and a **React** (Vite) frontend. This template comes pre-configured with **JWT Authentication**, user registration, and a modern UI powered by **shadcn/ui** and **Tailwind CSS**.

## ✨ Features

- **Backend (FastAPI):**
- ⚡ **High Performance:** Built on Python 3.10+ and Starlette.
- 🔐 **JWT Auth:** Secure authentication flow using OAuth2 Password Bearer.
- 🔑 **Password Hashing**
- 🗄️ **Database:** SQLAlchemy ORM with Migrations (Pydantic for data validation).
- 📑 **Self-Documenting:** Interactive API docs at `/docs` (Swagger).

- **Frontend (React):**
- ⚛️ **Vite-powered:** Ultra-fast HMR and build times.
- 🎨 **shadcn/ui:** Beautiful, accessible components built with Radix UI and Tailwind.
- 🔒 **Protected Routes:** Context-based auth guard for private pages.
- 📡 **Api Interceptors:** Global handling of JWT tokens and 401 Unauthorized errors.
- 📝 **Form Handling:** Integrated with `react-hook-form` and `zod`.

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, shadcn/ui, Zod, Zustand.
- **Backend:** FastAPI, Pydantic, SQLAlchemy, Alembic.

## 📂 Project Structure

### Backend

```

backend/
├── app/
│ ├── api/ # Route handlers / Endpoints
│ ├── core/ # Security (JWT), config, and constants
│ ├── db/ # Session management and engine setup
│ ├── exceptions/ # Custom API error handlers
│ ├── models/ # SQLAlchemy database models
│ ├── services/ # Business logic layer
│ ├── main.py # App entry point & middleware
│ └── env_sample # Backend environment template
├── migrations/ # Alembic migration files
├── tests/ # Pytest suite
├── alembic.ini # Migration configuration
└── requirements.txt # Project dependencies

```

### Frontend

```
frontend/
├── src/
│   ├── components/     # UI components (shadcn/ui)
│   ├── errors/         # Error boundary pages
│   ├── layouts/        # Layout wrappers (Auth/Dashboard)
│   ├── lib/            # Utility functions
│   ├── pages/          # Route views (Login, Register, etc.)
│   ├── schemas/        # Zod validation schemas
│   ├── services/       # API call modules
│   ├── store/          # Global state (Zustand)
│   ├── types/          # TypeScript definitions
│   └── App.tsx         # Main router and provider setup
├── components.json     # shadcn/ui config
└── vite.config.ts      # Vite build configuration
```

## 🚀 Getting Started

### 1. Backend Setup

1. **Navigate to backend:**

```bash
cd backend

```

2. **Create virtual environment:**

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

```

3. **Install dependencies:**

```bash
pip install -r requirements.txt

```

4. **Environment Variables:**
   Create a `.env` file from `.env.example`:

```bash
SECRET_KEY=your_super_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

```

5. **Run the server:**

```bash
uvicorn app.main:app --reload

```

### 2. Frontend Setup

1. **Navigate to frontend:**

```bash
cd frontend

```

2. **Install dependencies:**

```bash
npm install

```

3. **Configure API URL:**
   Update `.env.local` with your backend URL:

```bash
VITE_API_URL=http://localhost:8000

```

4. **Run the app:**

```bash
npm run dev

```

## 🔒 Authentication Flow

This project implements a secure Refresh Token strategy:

1. Login: The user submits credentials. The backend returns a short-lived Access Token (JSON) and sets a long-lived Refresh Token as an HttpOnly Cookie.
2. State Management: The Access Token is stored in the Zustand store in memory. It is never saved to localStorage to mitigate token theft.
3. Authorization: All outgoing requests via Api include the Access Token in the Authorization: Bearer header
4. Token Expiration: When the Access Token expires (e.g., after 15 minutes), the backend returns a 401 Unauthorized.
5. Silent Refresh: The Api interceptor in src/services/ catches the 401, automatically calls the refresh token endpoint (which reads the HttpOnly cookie), receives a new Access Token, and retries the original request.
6. Logout: The logout endpoint clears the HttpOnly cookie and the Zustand store.

## 🎨 UI Components (shadcn/ui)

This project uses **shadcn/ui**. To add new components, run:

```bash
pnpm dlx shadcn@latest add [component-name]

```
