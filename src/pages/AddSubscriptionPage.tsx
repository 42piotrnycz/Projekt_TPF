import { Link, useNavigate } from 'react-router-dom'
import { AddSubscriptionForm } from '../components/subscriptions/AddSubscriptionForm'
import { ROUTES } from '../routes'
import './AddSubscriptionPage.css'

export function AddSubscriptionPage() {
  const navigate = useNavigate()

  return (
    <div className="add-sub">
      <header className="page-header">
        <div className="page-header__text">
          <h1 className="page-header__title">Add Subscription</h1>
          <p className="page-header__subtitle">
            Track a new recurring payment in your portfolio.
          </p>
        </div>
        <Link to={ROUTES.subscriptions} className="app-btn app-btn--ghost">
          Cancel
        </Link>
      </header>

      <div className="app-card">
        <AddSubscriptionForm
          onSuccess={() => navigate(ROUTES.subscriptions, { replace: true })}
        />
      </div>
    </div>
  )
}
