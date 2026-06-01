import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../routes'
import { logout } from '../utils/authStorage'
import './DashboardPage.css'

export function DashboardPage() {
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate(ROUTES.welcome, { replace: true })
  }

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <h1 className="dashboard__title">Dashboard</h1>
        <button type="button" className="dashboard__logout" onClick={handleLogout}>
          Sign out
        </button>
      </header>
      <main className="dashboard__main" aria-label="Dashboard content">
        <p className="dashboard__placeholder">Expense overview will appear here.</p>
      </main>
    </div>
  )
}
