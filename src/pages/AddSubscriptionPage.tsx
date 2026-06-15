import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthTextField } from '../components/auth/AuthTextField'
import { IconArrowLeft, IconCalendar, IconPlus } from '../components/icons/AppIcons'
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  type BillingCycle,
  type SubscriptionCategory,
} from '../types/subscription'
import { ROUTES } from '../routes'
import { useSubscriptions } from '../hooks/useSubscriptions'
import { formatCurrency } from '../utils/formatCurrency'
import './EntryForm.css'

const categories = Object.keys(CATEGORY_LABELS) as SubscriptionCategory[]

const quickSelects: {
  name: string
  category: SubscriptionCategory
  amount: string
  color: string
}[] = [
  { name: 'Netflix', category: 'entertainment', amount: '43', color: '#ef4444' },
  { name: 'Spotify', category: 'music', amount: '19.99', color: '#22c55e' },
  { name: 'Microsoft 365', category: 'software', amount: '42', color: '#0ea5e9' },
  { name: 'Adobe Creative', category: 'software', amount: '90', color: '#f97316' },
]

function formatPreviewDate(date: string): string {
  if (!date) return 'Renewal date'
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export function AddSubscriptionPage() {
  const navigate = useNavigate()
  const { create } = useSubscriptions()
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<SubscriptionCategory>('entertainment')
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly')
  const [renewalDate, setRenewalDate] = useState('')
  const [autoPay, setAutoPay] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const previewAmount = Number(amount)
  const safePreviewAmount = Number.isNaN(previewAmount) ? 0 : previewAmount
  const monthlyPreviewAmount =
    billingCycle === 'yearly' ? safePreviewAmount / 12 : safePreviewAmount

  function validate(): boolean {
    const next: Record<string, string> = {}
    if (!name.trim()) next.name = 'Enter a service name.'
    const parsed = Number(amount)
    if (!amount || Number.isNaN(parsed) || parsed <= 0) {
      next.amount = 'Enter a valid plan cost.'
    }
    if (!renewalDate) next.renewalDate = 'Select a renewal date.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    create({
      name: name.trim(),
      amount: Number(amount),
      billingCycle,
      category,
      renewalDate,
      status: 'active',
      autoPay,
      iconColor: CATEGORY_COLORS[category],
    })

    navigate(ROUTES.subscriptions, { replace: true })
  }

  return (
    <div className="entry-form-page">
      <header className="page-header">
        <div className="entry-form-page__heading">
          <Link
            to={ROUTES.subscriptions}
            className="app-btn app-btn--ghost entry-form-page__back"
            aria-label="Back to subscriptions"
          >
            <IconArrowLeft />
          </Link>
          <div className="page-header__text">
            <h1 className="page-header__title">Add New Subscription</h1>
            <p className="page-header__subtitle">
              Track recurring expenses with precision and gain control over your digital capital.
            </p>
          </div>
        </div>
      </header>

      <div className="entry-form-page__layout">
        <form className="app-card entry-form" onSubmit={handleSubmit} noValidate>
          <div className="entry-form__grid">
            <AuthTextField
              label="Service Name"
              name="name"
              placeholder="e.g. Netflix, Adobe, AWS"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
            />

            <div className="entry-form__field">
              <label className="auth-field__label" htmlFor="category">
                Category
              </label>
              <select
                id="category"
                className="entry-form__select"
                value={category}
                onChange={(e) => setCategory(e.target.value as SubscriptionCategory)}
              >
                {categories.map((key) => (
                  <option key={key} value={key}>
                    {CATEGORY_LABELS[key]}
                  </option>
                ))}
              </select>
            </div>

            <AuthTextField
              label="Plan Cost"
              name="amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              error={errors.amount}
            />

            <div className="entry-form__field">
              <span className="auth-field__label">Billing Cycle</span>
              <div className="entry-form__segment" role="group" aria-label="Billing cycle">
                {(['monthly', 'yearly'] as BillingCycle[]).map((cycle) => (
                  <button
                    key={cycle}
                    type="button"
                    className={`entry-form__segment-btn${
                      billingCycle === cycle ? ' entry-form__segment-btn--active' : ''
                    }`}
                    onClick={() => setBillingCycle(cycle)}
                  >
                    {cycle === 'monthly' ? 'Monthly' : 'Yearly'}
                  </button>
                ))}
              </div>
            </div>

            <AuthTextField
              label="Renewal Date"
              name="renewalDate"
              type="date"
              value={renewalDate}
              onChange={(e) => setRenewalDate(e.target.value)}
              error={errors.renewalDate}
            />

            <label className="entry-form__switch">
              <span className="entry-form__switch-copy">
                <span className="entry-form__switch-title">Auto-pay</span>
                <span className="entry-form__switch-hint">
                  Enable automatic renewal reminders
                </span>
              </span>
              <input
                type="checkbox"
                checked={autoPay}
                onChange={(e) => setAutoPay(e.target.checked)}
              />
            </label>
          </div>

          <div className="entry-form__actions">
            <button type="submit" className="app-btn app-btn--primary">
              Add Subscription
            </button>
            <Link to={ROUTES.subscriptions} className="app-btn app-btn--ghost">
              Cancel
            </Link>
          </div>
        </form>

        <aside className="entry-form-aside">
          <section className="app-card entry-form__preview">
            <p className="app-card__title">Quick Select Popular</p>
            <div className="entry-form__quick-list">
              {quickSelects.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  className="entry-form__quick-btn"
                  onClick={() => {
                    setName(item.name)
                    setCategory(item.category)
                    setAmount(item.amount)
                  }}
                >
                  <span
                    className="entry-form__quick-logo"
                    style={{ background: item.color }}
                    aria-hidden
                  >
                    {item.name.charAt(0)}
                  </span>
                  <span className="entry-form__quick-main">
                    <span className="entry-form__quick-title">{item.name}</span>
                    <span className="entry-form__quick-meta">
                      {CATEGORY_LABELS[item.category]}
                    </span>
                  </span>
                  <IconPlus />
                </button>
              ))}
            </div>
          </section>

          <section className="app-card entry-form__preview">
            <p className="app-card__title">Subscription Preview</p>
            <div className="entry-form__preview-card">
              <span className="entry-form__preview-icon">
                <IconCalendar />
              </span>
              <div className="entry-form__preview-main">
                <span className="entry-form__preview-title">
                  {name.trim() || 'New Subscription'}
                </span>
                <p className="entry-form__preview-meta">
                  {billingCycle === 'monthly' ? 'Monthly' : 'Yearly'} renewal - {formatPreviewDate(renewalDate)}
                </p>
              </div>
              <div className="entry-form__preview-side">
                <span className="entry-form__preview-amount">
                  {formatCurrency(safePreviewAmount)}
                </span>
                <span className="entry-form__preview-badge">
                  {formatCurrency(monthlyPreviewAmount)}/mo
                </span>
              </div>
            </div>
            <p className="entry-form__preview-copy">
              Yearly plans are shown as full charges in the calendar and normalized
              to a monthly cost in subscription stats.
            </p>
          </section>

          <section className="entry-form__tip" aria-label="Subscription tip">
            <div className="entry-form__tip-copy">
              <span className="entry-form__tip-title">Pro tip</span>
              <p className="entry-form__preview-copy">
                Consolidate annual subscriptions to keep monthly projections precise.
              </p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}