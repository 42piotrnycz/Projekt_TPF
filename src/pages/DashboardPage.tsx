import { Link } from 'react-router-dom'
import { IconArrowRight, IconBell } from '../components/icons/AppIcons'
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  getSubscriptionMonthlyAmount,
} from '../types/subscription'
import type { Subscription } from '../types/subscription'
import { ROUTES } from '../routes'
import { daysUntil, formatRenewalLabel } from '../utils/dateLabels'
import { formatCurrency } from '../utils/formatCurrency'
import { useSubscriptions } from '../hooks/useSubscriptions'
import { getCategoryBreakdown, getTopExpenses, getUpcoming } from '../utils/subscriptionStorage'
import './DashboardPage.css'

function TrialAlert({ subscription }: { subscription: Subscription }) {
  const days = daysUntil(subscription.trialEndsAt ?? subscription.renewalDate)

  return (
    <div className="dashboard-alert">
      <div className="dashboard-alert__header">
        <IconBell />
        <span>Action Required</span>
      </div>
      <h3 className="dashboard-alert__title">{subscription.name} Trial Ending</h3>
      <p className="dashboard-alert__text">
        Trial period ends in {days} {days === 1 ? 'day' : 'days'}. You will be charged{' '}
        {formatCurrency(subscription.amount)}.
      </p>
      <div className="dashboard-alert__actions">
        <button type="button" className="app-btn app-btn--danger app-btn--sm">
          Cancel
        </button>
        <button type="button" className="app-btn app-btn--ghost app-btn--sm">
          Keep
        </button>
      </div>
    </div>
  )
}

export function DashboardPage() {
  const { subscriptions } = useSubscriptions()
  const active = subscriptions.filter((s) => s.status === 'active')
  const total = active.reduce((sum, s) => sum + getSubscriptionMonthlyAmount(s), 0)
  const upcoming = getUpcoming(7)
  const topExpenses = getTopExpenses(3)
  const breakdown = getCategoryBreakdown()
  const maxExpense = topExpenses[0]
    ? getSubscriptionMonthlyAmount(topExpenses[0])
    : 1
  const trialSub = subscriptions.find((s) => s.trialEndsAt)

  return (
    <div className="dashboard">
      <header className="page-header">
        <div className="page-header__text">
          <h1 className="page-header__title">Dashboard</h1>
          <p className="page-header__subtitle">
            Overview of your subscriptions and monthly costs.
          </p>
        </div>
      </header>

      <div className="dashboard__grid">
        <section className="app-card dashboard__cost">
          <p className="dashboard__cost-label">Total Monthly Cost</p>
          <p className="dashboard__cost-value">{formatCurrency(total)}</p>
          <p className="dashboard__cost-trend">↓ 2.4% vs last month</p>
          <svg className="dashboard__sparkline" viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden>
            <path
              d="M0 30 Q50 10 100 25 T200 15"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="2"
              opacity="0.6"
            />
          </svg>
        </section>

        {trialSub && <TrialAlert subscription={trialSub} />}

        <section className="app-card dashboard__upcoming">
          <div className="dashboard__section-head">
            <h2 className="app-card__title">Upcoming (Next 7 Days)</h2>
            <Link to={ROUTES.subscriptions} className="dashboard__link">
              View All <IconArrowRight />
            </Link>
          </div>
          <ul className="dashboard__list">
            {upcoming.map((sub) => (
              <li key={sub.id} className="dashboard__list-item">
                <div
                  className="service-icon"
                  style={{ background: sub.iconColor }}
                  aria-hidden
                >
                  {sub.name.charAt(0)}
                </div>
                <div className="dashboard__list-body">
                  <span className="dashboard__list-name">{sub.name}</span>
                  <span className="dashboard__list-meta">
                    {formatRenewalLabel(sub.renewalDate)} • {CATEGORY_LABELS[sub.category]}
                  </span>
                </div>
                <div className="dashboard__list-end">
                  <span className="dashboard__list-price">{formatCurrency(sub.amount)}</span>
                  {sub.autoPay && <span className="badge badge--autopay">Auto-pay</span>}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="app-card dashboard__expenses">
          <h2 className="app-card__title">Top Expenses</h2>
          <ul className="dashboard__bars">
            {topExpenses.map((sub) => (
              <li key={sub.id} className="dashboard__bar-item">
                <div className="dashboard__bar-head">
                  <span>{sub.name}</span>
                  <span>{formatCurrency(getSubscriptionMonthlyAmount(sub))}/mo</span>
                </div>
                <div className="dashboard__bar-track">
                  <div
                    className="dashboard__bar-fill"
                    style={{
                      width: `${(getSubscriptionMonthlyAmount(sub) / maxExpense) * 100}%`,
                      background: sub.iconColor,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="app-card dashboard__categories">
          <h2 className="app-card__title">Category Breakdown</h2>
          <div className="dashboard__donut-wrap">
            <div className="dashboard__donut" aria-hidden />
            <ul className="dashboard__legend">
              {breakdown.map(({ category, percent }) => (
                <li key={category}>
                  <span
                    className="dashboard__legend-dot"
                    style={{ background: CATEGORY_COLORS[category] }}
                  />
                  <span>{CATEGORY_LABELS[category]}</span>
                  <span className="dashboard__legend-pct">{percent}%</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}
