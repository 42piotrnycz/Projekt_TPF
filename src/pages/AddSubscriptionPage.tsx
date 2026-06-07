import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthTextField } from '../components/auth/AuthTextField'
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  type SubscriptionCategory,
} from '../types/subscription'
import { ROUTES } from '../routes'
import { useSubscriptions } from '../hooks/useSubscriptions'
import './AddSubscriptionPage.css'

const categories = Object.keys(CATEGORY_LABELS) as SubscriptionCategory[]

export function AddSubscriptionPage() {
  const navigate = useNavigate()
  const { create } = useSubscriptions()
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<SubscriptionCategory>('entertainment')
  const [renewalDate, setRenewalDate] = useState('')
  const [autoPay, setAutoPay] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate(): boolean {
    const next: Record<string, string> = {}
    if (!name.trim()) next.name = 'Enter a service name.'
    const parsed = Number(amount)
    if (!amount || Number.isNaN(parsed) || parsed <= 0) {
      next.amount = 'Enter a valid monthly amount.'
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
      category,
      renewalDate,
      status: 'active',
      autoPay,
      iconColor: CATEGORY_COLORS[category],
    })

    navigate(ROUTES.subscriptions, { replace: true })
  }

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

      <form className="app-card add-sub__form" onSubmit={handleSubmit} noValidate>
        <AuthTextField
          label="Service Name"
          name="name"
          placeholder="e.g. Netflix"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />

        <AuthTextField
          label="Monthly Amount (PLN)"
          name="amount"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          error={errors.amount}
        />

        <div className="add-sub__field">
          <label className="auth-field__label" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            className="add-sub__select"
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
          label="Next Renewal Date"
          name="renewalDate"
          type="date"
          value={renewalDate}
          onChange={(e) => setRenewalDate(e.target.value)}
          error={errors.renewalDate}
        />

        <label className="add-sub__checkbox">
          <input
            type="checkbox"
            checked={autoPay}
            onChange={(e) => setAutoPay(e.target.checked)}
          />
          <span>Enable auto-pay</span>
        </label>

        <button type="submit" className="app-btn app-btn--primary add-sub__submit">
          Save Subscription
        </button>
      </form>
    </div>
  )
}
