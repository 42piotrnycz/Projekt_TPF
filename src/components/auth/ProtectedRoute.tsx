import { Navigate, Outlet } from 'react-router-dom'
import { ROUTES } from '../../routes'
import { getSession } from '../../utils/authStorage'

export function ProtectedRoute() {
  if (!getSession()) {
    return <Navigate to={ROUTES.login} replace />
  }
  return <Outlet />
}
