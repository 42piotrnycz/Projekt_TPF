import { Navigate, Outlet } from 'react-router-dom'
import { ROUTES } from '../../routes'
import { useAuth } from '../../hooks/useAuth'

export function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) return null

  if (!user) {
    return <Navigate to={ROUTES.login} replace />
  }

  return <Outlet />
}
