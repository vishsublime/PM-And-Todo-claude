import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute, AdminRoute } from './routes/ProtectedRoute'
import { DashboardLayout } from './components/Layout/DashboardLayout'
import { LoginPage } from './pages/Login'
import { RegisterPage } from './pages/Register'
import { DashboardPage } from './pages/Dashboard'
import { UsersPage } from './pages/users/UsersPage'
import { InvitationsPage } from './pages/invitations/InvitationsPage'
import { RolesPage } from './pages/roles/RolesPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Admin-only routes */}
            <Route element={<AdminRoute />}>
              <Route path="/settings/users" element={<UsersPage />} />
              <Route path="/settings/invitations" element={<InvitationsPage />} />
              <Route path="/settings/roles" element={<RolesPage />} />
            </Route>
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
