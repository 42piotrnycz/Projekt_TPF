import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { AppShell } from './components/layout/AppShell'
import { AddSubscriptionPage } from './pages/AddSubscriptionPage'
import { CalendarPage } from './pages/CalendarPage'
import { DashboardPage } from './pages/DashboardPage'
import { SavingsPage } from './pages/SavingsPage'
import { SubscriptionsPage } from './pages/SubscriptionsPage'
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
        <Route element={<AppShell />}>
          <Route index element={<Navigate to={ROUTES.dashboard} replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="subscriptions" element={<SubscriptionsPage />} />
          <Route path="subscriptions/new" element={<AddSubscriptionPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="savings" element={<SavingsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to={ROUTES.welcome} replace />} />
    </Routes>
  )
}
