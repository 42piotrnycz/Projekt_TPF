import { FormEvent, useState, type CSSProperties } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthTextField } from '../components/auth/AuthTextField'
import {
  IconArrowLeft,
  IconBriefcase,
  IconCalendar,
  IconMore,
  IconShoppingBag,
  IconUtensils,
} from '../components/icons/AppIcons'
import { useManualEntries } from '../hooks/useManualEntries'
import { ROUTES } from '../routes'
import {
  MANUAL_ENTRY_COLORS,
  MANUAL_ENTRY_LABELS,
  type ManualEntryCategory,
} from '../types/manualEntry'
import { formatCurrency } from '../utils/formatCurrency'
import './EntryForm.css'

const categories = Object.keys(MANUAL_ENTRY_LABELS) as ManualEntryCategory[]

const categoryIcons = {
  food: IconUtensils,
  shopping: IconShoppingBag,
  services: IconBriefcase,
  other: IconMore,
} as const

function formatPreviewDate(date: string): string {
  if (!date) return 'Schedule date'
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export function AddManualEntryPage() {
  const navigate = useNavigate()
  const { create } = useManualEntries()
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')
  const [category, setCategory] = useState<ManualEntryCategory>('shopping')
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const previewTitle = title.trim() || 'New Entry'
  const previewAmount = amount ? Number(amount) : 0

  function validate(): boolean {
    const next: Record<string, string> = {}
    const parsed = Number(amount)
    if (!title.trim()) next.title = 'Enter an entry title.'
    if (!amount || Number.isNaN(parsed) || parsed <= 0) {
      next.amount = 'Enter a valid amount.'
    }
    if (!date) next.date = 'Select a payment date.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    create({
      title: title.trim(),
      amount: Number(amount),
      date,
      category,
      notes: notes.trim() || undefined,
      iconColor: MANUAL_ENTRY_COLORS[category],
    })

    navigate(ROUTES.calendar, { replace: true })
  }

  return (
    <div className="entry-form-page">
      <header className="page-header">
        <div className="entry-form-page__heading">
          <Link
            to={ROUTES.calendar}
            className="app-btn app-btn--ghost entry-form-page__back"
            aria-label="Back to calendar"
          >
            <IconArrowLeft />
          </Link>
          <div className="page-header__text">
            <h1 className="page-header__title">Add Manual Entry</h1>
            <p className="page-header__subtitle">
              One-time expense for Payment Calendar
            </p>
          </div>
        </div>
      </header>

      <div className="entry-form-page__layout">
        <form className="app-card entry-form" onSubmit={handleSubmit} noValidate>
          <div className="entry-form__grid">
            <AuthTextField
              className="entry-form__full"
              label="Title"
              name="title"
              placeholder="e.g. Annual Gym Membership"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={errors.title}
            />

            <AuthTextField
              label="Amount"
              name="amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              error={errors.amount}
            />

            <AuthTextField
              label="Date"
              name="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              error={errors.date}
            />

            <div className="entry-form__field entry-form__full">
              <span className="auth-field__label">Category</span>
              <div className="entry-form__category-grid">
                {categories.map((key) => {
                  const Icon = categoryIcons[key]
                  return (
                    <button
                      key={key}
                      type="button"
                      className={`entry-form__category-tile${
                        category === key ? ' entry-form__category-tile--active' : ''
                      }`}
                      style={{ '--category-color': MANUAL_ENTRY_COLORS[key] } as CSSProperties}
                      onClick={() => setCategory(key)}
                    >
                      <span className="entry-form__category-icon">
                        <Icon />
                      </span>
                      {MANUAL_ENTRY_LABELS[key]}
                    </button>
                  )
                })}
              </div>
            </div>

            <label className="entry-form__field entry-form__full" htmlFor="notes">
              <span className="auth-field__label">Notes</span>
              <textarea
                id="notes"
                className="entry-form__textarea"
                placeholder="Additional details..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </label>
          </div>

          <div className="entry-form__actions">
            <button type="submit" className="app-btn app-btn--primary">
              Add to Calendar
            </button>
            <Link to={ROUTES.calendar} className="app-btn app-btn--ghost">
              Cancel
            </Link>
          </div>
        </form>

        <aside className="entry-form-aside">
          <section className="app-card entry-form__preview">
            <p className="app-card__title">Visual Preview</p>
            <div className="entry-form__preview-card">
              <span className="entry-form__preview-icon">
                <IconCalendar />
              </span>
              <div className="entry-form__preview-main">
                <span className="entry-form__preview-title">{previewTitle}</span>
                <p className="entry-form__preview-meta">
                  Scheduled for {formatPreviewDate(date)}
                </p>
              </div>
              <div className="entry-form__preview-side">
                <span className="entry-form__preview-amount">
                  {formatCurrency(Number.isNaN(previewAmount) ? 0 : previewAmount)}
                </span>
                <span className="entry-form__preview-badge">One-time</span>
              </div>
            </div>
            <p className="entry-form__preview-copy">
              This entry will appear in your Payment Calendar as a dashed item to
              distinguish it from recurring subscriptions.
            </p>
          </section>

          <section className="entry-form__tip" aria-label="Organization tip">
            <div className="entry-form__tip-copy">
              <span className="entry-form__tip-title">Stay organized.</span>
              <p className="entry-form__preview-copy">
                Track every one-time cost with the same precision as recurring payments.
              </p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
