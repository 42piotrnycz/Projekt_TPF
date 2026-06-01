import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'
import { WelcomePage } from './pages/auth/WelcomePage'
import { ROUTES } from './routes'
import { getSession } from './utils/authStorage'

function PublicOnly({ children }: { children: ReactNode }) {
  if (getSession()) {
    return <Navigate to={ROUTES.dashboard} replace />
  }
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route
        path={ROUTES.welcome}
        element={
          <PublicOnly>
            <WelcomePage />
          </PublicOnly>
        }
      />
      <Route
        path={ROUTES.login}
        element={
          <PublicOnly>
            <LoginPage />
          </PublicOnly>
        }
      />
      <Route
        path={ROUTES.register}
        element={
          <PublicOnly>
            <RegisterPage />
          </PublicOnly>
        }
      />
      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.dashboard} element={<DashboardPage />} />
      </Route>
      <Route path="*" element={<Navigate to={ROUTES.welcome} replace />} />
    </Routes>
  )
}
