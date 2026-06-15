import { FormEvent, useEffect, useState } from 'react'
import { AuthTextField } from '../auth/AuthTextField'
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  type SubscriptionCategory,
} from '../../types/subscription'
import { useSubscriptions } from '../../hooks/useSubscriptions'
import '../../pages/AddSubscriptionPage.css'

const categories = Object.keys(CATEGORY_LABELS) as SubscriptionCategory[]

interface AddSubscriptionFormProps {
  defaultRenewalDate?: string
  onSuccess?: () => void
  onCancel?: () => void
  compact?: boolean
}

export function AddSubscriptionForm({
  defaultRenewalDate = '',
  onSuccess,
  onCancel,
  compact = false,
}: AddSubscriptionFormProps) {
  const { create } = useSubscriptions()
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<SubscriptionCategory>('entertainment')
  const [renewalDate, setRenewalDate] = useState(defaultRenewalDate)
  const [autoPay, setAutoPay] = useState(true)
  const [recurring, setRecurring] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setRenewalDate(defaultRenewalDate)
  }, [defaultRenewalDate])

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
      billingCycle: 'monthly',
      category,
      renewalDate,
      status: 'active',
      autoPay,
      recurring,
      iconColor: CATEGORY_COLORS[category],
    })

    setName('')
    setAmount('')
    setRenewalDate(defaultRenewalDate)
    setErrors({})
    onSuccess?.()
  }

  return (
    <form
      className={`add-sub__form${compact ? ' add-sub__form--compact' : ''}`}
      onSubmit={handleSubmit}
      noValidate
    >
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
        label="Renewal Date"
        name="renewalDate"
        type="date"
        value={renewalDate}
        onChange={(e) => setRenewalDate(e.target.value)}
        error={errors.renewalDate}
      />

      <label className="add-sub__checkbox">
        <input
          type="checkbox"
          checked={recurring}
          onChange={(e) => setRecurring(e.target.checked)}
        />
        <span>Recurring (every month on this day)</span>
      </label>

      <label className="add-sub__checkbox">
        <input
          type="checkbox"
          checked={autoPay}
          onChange={(e) => setAutoPay(e.target.checked)}
        />
        <span>Enable auto-pay</span>
      </label>

      <div className="add-sub__actions">
        {onCancel && (
          <button type="button" className="app-btn app-btn--ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="app-btn app-btn--primary add-sub__submit">
          Save
        </button>
      </div>
    </form>
  )
}
