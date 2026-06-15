import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AnalyticsListener } from './components/AnalyticsListener'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { AppShell } from './components/layout/AppShell'
import { useAuth } from './hooks/useAuth'
import { AddSubscriptionPage } from './pages/AddSubscriptionPage'
import { AddManualEntryPage } from './pages/AddManualEntryPage'
import { CalendarPage } from './pages/CalendarPage'
import { DashboardPage } from './pages/DashboardPage'
import { ProfilePage } from './pages/ProfilePage'
import { SavingsPage } from './pages/SavingsPage'
import { SubscriptionsPage } from './pages/SubscriptionsPage'
import { LoginPage } from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'
import { WelcomePage } from './pages/auth/WelcomePage'
import { ROUTES } from './routes'

function PublicOnly({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to={ROUTES.dashboard} replace />
  return <>{children}</>
}

export default function App() {
  return (
    <>
    <AnalyticsListener />
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
          <Route path="calendar/new" element={<AddManualEntryPage />} />
          <Route path="savings" element={<SavingsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to={ROUTES.welcome} replace />} />
    </Routes>
    </>
  )
}
