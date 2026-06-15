import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { IconCheck, IconPause, IconPlus, IconWallet } from '../components/icons/AppIcons'
import { SubscriptionRow } from '../components/subscriptions/SubscriptionRow'
import { useSubscriptions } from '../hooks/useSubscriptions'
import { CATEGORY_LABELS, getSubscriptionMonthlyAmount } from '../types/subscription'
import type { SubscriptionCategory } from '../types/subscription'
import { ROUTES } from '../routes'
import { formatCurrency } from '../utils/formatCurrency'
import './SubscriptionsPage.css'

type FilterKey = 'all' | SubscriptionCategory

const filters: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'entertainment', label: 'Entertainment' },
  { key: 'software', label: 'Software' },
]

export function SubscriptionsPage() {
  const { subscriptions, update } = useSubscriptions()
  const [filter, setFilter] = useState<FilterKey>('all')
  const [sort, setSort] = useState<'renewal' | 'amount' | 'name'>('renewal')

  const active = subscriptions.filter((s) => s.status === 'active')
  const paused = subscriptions.filter((s) => s.status === 'paused')
  const monthlyTotal = active.reduce((sum, s) => sum + getSubscriptionMonthlyAmount(s), 0)

  const filtered = useMemo(() => {
    let list = [...subscriptions]
    if (filter !== 'all') {
      list = list.filter((s) => s.category === filter)
    }
    if (sort === 'renewal') {
      list.sort((a, b) => a.renewalDate.localeCompare(b.renewalDate))
    } else if (sort === 'amount') {
      list.sort((a, b) => getSubscriptionMonthlyAmount(b) - getSubscriptionMonthlyAmount(a))
    } else {
      list.sort((a, b) => a.name.localeCompare(b.name))
    }
    return list
  }, [subscriptions, filter, sort])

  function handleToggle(id: string) {
    const sub = subscriptions.find((s) => s.id === id)
    if (!sub) return
    update(id, { status: sub.status === 'active' ? 'paused' : 'active' })
  }

  return (
    <div className="subscriptions-page">
      <header className="page-header">
        <div className="page-header__text">
          <h1 className="page-header__title">My Subscriptions</h1>
          <p className="page-header__subtitle">
            Manage your recurring payments and services.
          </p>
        </div>
        <Link to={ROUTES.subscriptionsNew} className="app-btn app-btn--primary">
          <IconPlus />
          Add Subscription
        </Link>
      </header>

      <div className="stat-grid">
        <div className="stat-card">
          <div>
            <p className="stat-card__label">Total Monthly Spend</p>
            <p className="stat-card__value">{formatCurrency(monthlyTotal)}</p>
          </div>
          <span className="stat-card__icon">
            <IconWallet />
          </span>
        </div>
        <div className="stat-card">
          <div>
            <p className="stat-card__label">Active Subscriptions</p>
            <p className="stat-card__value">{active.length}</p>
          </div>
          <span className="stat-card__icon">
            <IconCheck />
          </span>
        </div>
        <div className="stat-card">
          <div>
            <p className="stat-card__label">Paused Subscriptions</p>
            <p className="stat-card__value">{paused.length}</p>
          </div>
          <span className="stat-card__icon">
            <IconPause />
          </span>
        </div>
      </div>

      <div className="subscriptions-page__toolbar">
        <div className="subscriptions-page__filters">
          <span className="subscriptions-page__toolbar-label">Filter by:</span>
          <div className="filter-pills">
            {filters.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                className={`filter-pill${filter === key ? ' filter-pill--active' : ''}`}
                onClick={() => setFilter(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <label className="subscriptions-page__sort">
          <span>Sort:</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
            <option value="renewal">Renewal Date</option>
            <option value="amount">Amount</option>
            <option value="name">Name</option>
          </select>
        </label>
      </div>

      <div className="subscriptions-page__list">
        {filtered.length === 0 ? (
          <p className="subscriptions-page__empty">
            No subscriptions in {filter === 'all' ? 'your list' : CATEGORY_LABELS[filter]}.
          </p>
        ) : (
          filtered.map((sub) => (
            <SubscriptionRow key={sub.id} subscription={sub} onToggle={handleToggle} />
          ))
        )}
      </div>
    </div>
  )
}
