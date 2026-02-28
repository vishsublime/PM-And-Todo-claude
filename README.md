# PRISM Frontend

Multi-tenant project management portal — React + Vite frontend.

## Tech Stack

- **React 18** + **Vite 5**
- **React Router v6**
- **Zustand** (auth state)
- **Axios** with JWT interceptor + auto-refresh

## Quick Start

### Prerequisites
- Node.js 18+
- PRISM backend running on port 8080

### 1. Configure environment

Create a `.env` file (copy from `.env.example`):

```
VITE_API_BASE_URL=http://localhost:8080
```

### 2. Install and run

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`.

## Pages

| Route                   | Access  | Description               |
|-------------------------|---------|---------------------------|
| `/login`                | Public  | Sign in                   |
| `/register?token=xxx`   | Public  | Complete invitation        |
| `/dashboard`            | All     | Home dashboard            |
| `/settings/users`       | ADMIN   | User management           |
| `/settings/invitations` | ADMIN   | Invitation management     |
| `/settings/roles`       | ADMIN   | Role management           |

## Auth Flow

1. Login → receives `accessToken` (in memory) + `refreshToken` (persisted)
2. Axios interceptor attaches `Bearer <token>` to all requests
3. On 401 → auto-refresh using `refreshToken`, retry original request
4. On refresh failure → logout and redirect to `/login`

## Deploy to Vercel

1. Connect GitHub repo to Vercel
2. Framework: **Vite**
3. Set `VITE_API_BASE_URL` to your Render backend URL
4. Deploy
