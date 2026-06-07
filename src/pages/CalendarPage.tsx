import { useState } from 'react'
import { Link } from 'react-router-dom'
import { IconCalendar, IconPlus } from '../components/icons/AppIcons'
import { CATEGORY_LABELS } from '../types/subscription'
import type { SubscriptionCategory } from '../types/subscription'
import { ROUTES } from '../routes'
import { useSubscriptions } from '../hooks/useSubscriptions'
import { formatCurrency } from '../utils/formatCurrency'
import './CalendarPage.css'

const LEGEND = {
  productivity: { label: 'Productivity', color: '#3b82f6' },
  entertainment: { label: 'Entertainment', color: '#ef4444' },
  utilities: { label: 'Utilities', color: '#22c55e' },
  highPriority: { label: 'High Priority', color: '#f97316' },
} as const

type LegendKey = keyof typeof LEGEND

function toLegendKey(category: SubscriptionCategory, amount: number): LegendKey {
  if (amount >= 80) return 'highPriority'
  if (category === 'entertainment' || category === 'streaming') return 'entertainment'
  if (category === 'music' || category === 'health') return 'utilities'
  return 'productivity'
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const DAY_NAMES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

function IconFilter() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function IconEdit() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
      />
      <path
        d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
      />
    </svg>
  )
}

export function CalendarPage() {
  const { subscriptions } = useSubscriptions()
  const today = new Date()

  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate())

  const active = subscriptions.filter((s) => s.status === 'active')

  const dayMap = new Map<number, typeof active>()
  for (const sub of active) {
    const d = new Date(sub.renewalDate + 'T00:00:00')
    if (d.getFullYear() === viewYear && d.getMonth() === viewMonth) {
      const day = d.getDate()
      const list = dayMap.get(day) ?? []
      list.push(sub)
      dayMap.set(day, list)
    }
  }

  const firstDow = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array<null>(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  function prevMonth() {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11) }
    else setViewMonth((m) => m - 1)
    setSelectedDay(null)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0) }
    else setViewMonth((m) => m + 1)
    setSelectedDay(null)
  }

  const isCurrentMonthView =
    viewYear === today.getFullYear() && viewMonth === today.getMonth()

  const selectedSubs = selectedDay ? (dayMap.get(selectedDay) ?? []) : []
  const selectedTotal = selectedSubs.reduce((sum, s) => sum + s.amount, 0)

  const selectedDateLabel = selectedDay
    ? new Date(viewYear, viewMonth, selectedDay).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
      })
    : `${MONTH_NAMES[viewMonth]} ${viewYear}`

  return (
    <div className="cal-page">
      <header className="page-header">
        <div className="page-header__text">
          <h1 className="page-header__title">Payment Calendar</h1>
          <p className="page-header__subtitle">
            Track and manage your upcoming subscription charges.
          </p>
        </div>
        <div className="cal-page__header-actions">
          <button type="button" className="app-btn app-btn--ghost app-btn--sm cal-page__filter-btn">
            <IconFilter />
            Filter
          </button>
          <Link to={ROUTES.subscriptionsNew} className="app-btn app-btn--primary app-btn--sm">
            <IconPlus />
            Add Manual Entry
          </Link>
        </div>
      </header>

      <div className="cal-page__body">
        <section className="app-card cal-page__calendar">
          <div className="cal-page__cal-nav">
            <h2 className="cal-page__cal-month">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </h2>
            <div className="cal-page__cal-arrows">
              <button
                type="button"
                className="cal-page__arrow"
                onClick={prevMonth}
                aria-label="Previous month"
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                className="cal-page__arrow"
                onClick={nextMonth}
                aria-label="Next month"
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          <div className="cal-page__day-names">
            {DAY_NAMES.map((d) => (
              <span key={d} className="cal-page__day-name">{d}</span>
            ))}
          </div>

          <div className="cal-page__grid">
            {cells.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} className="cal-page__cell cal-page__cell--empty" />

              const subs = dayMap.get(day) ?? []
              const isToday = isCurrentMonthView && day === today.getDate()
              const isSelected = day === selectedDay

              const seen = new Set<string>()
              const dots: string[] = []
              for (const sub of subs) {
                const color = LEGEND[toLegendKey(sub.category, sub.amount)].color
                if (!seen.has(color)) { seen.add(color); dots.push(color) }
                if (dots.length === 3) break
              }

              return (
                <div
                  key={day}
                  className={[
                    'cal-page__cell',
                    isToday ? 'cal-page__cell--today' : '',
                    isSelected ? 'cal-page__cell--selected' : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => setSelectedDay(day)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedDay(day)}
                  aria-label={`${day} ${MONTH_NAMES[viewMonth]}${subs.length ? `, ${subs.length} payment${subs.length > 1 ? 's' : ''}` : ''}`}
                  aria-pressed={isSelected}
                >
                  <span className="cal-page__cell-num">{day}</span>
                  {dots.length > 0 && (
                    <div className="cal-page__dots">
                      {dots.map((color, j) => (
                        <span key={j} className="cal-page__dot" style={{ background: color }} />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        <aside className="cal-page__sidebar">
          <div className="app-card cal-page__detail">
            <p className="app-card__title">Selected Date</p>
            <div className="cal-page__detail-date-row">
              <IconCalendar />
              <h2 className="cal-page__detail-date">{selectedDateLabel}</h2>
            </div>

            <div className="cal-page__total-card">
              <p className="cal-page__total-label">Total Due</p>
              <p className="cal-page__total-amount">{formatCurrency(selectedTotal)}</p>
            </div>

            {selectedSubs.length > 0 && (
              <>
                <p className="cal-page__payments-title">Scheduled Payments</p>
                <ul className="cal-page__payments-list">
                  {selectedSubs.map((sub) => (
                    <li key={sub.id} className="cal-page__payment-item">
                      <div
                        className="service-icon"
                        style={{ background: sub.iconColor }}
                        aria-hidden
                      >
                        {sub.name.charAt(0)}
                      </div>
                      <div className="cal-page__payment-body">
                        <span className="cal-page__payment-name">{sub.name}</span>
                        <span className="cal-page__payment-cat">
                          {CATEGORY_LABELS[sub.category]}
                        </span>
                      </div>
                      <span className="cal-page__payment-price">
                        {formatCurrency(sub.amount)}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {selectedSubs.length === 0 && selectedDay && (
              <p className="cal-page__no-payments">No payments scheduled for this day.</p>
            )}

            <Link to={ROUTES.subscriptions} className="app-btn app-btn--ghost cal-page__manage-btn">
              <IconEdit />
              Manage Subscriptions
            </Link>
          </div>

          <div className="app-card cal-page__legend">
            <p className="app-card__title">Category Legend</p>
            <div className="cal-page__legend-grid">
              {Object.values(LEGEND).map(({ label, color }) => (
                <div key={label} className="cal-page__legend-item">
                  <span className="cal-page__dot" style={{ background: color }} />
                  <span className="cal-page__legend-label">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
