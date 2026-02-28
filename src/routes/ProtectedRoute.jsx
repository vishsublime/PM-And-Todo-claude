import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export function ProtectedRoute() {
  const { user } = useAuthStore()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

export function AdminRoute() {
  const { user } = useAuthStore()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (user.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
