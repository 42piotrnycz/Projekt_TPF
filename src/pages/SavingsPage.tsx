import { useMemo, useState } from 'react'
import { IconCheck, IconPlus } from '../components/icons/AppIcons'
import './SavingsPage.css'

type SavingsService = {
  id: string
  name: string
  category: string
  amount: number
  icon: string
  color: string
}

const SERVICES: SavingsService[] = [
  {
    id: 'streaming-plus',
    name: 'Streaming Plus',
    category: 'Entertainment',
    amount: 18,
    icon: 'SP',
    color: '#ef6f82',
  },
  {
    id: 'gym-elite',
    name: 'Gym Elite',
    category: 'Health & Fitness',
    amount: 85,
    icon: 'GE',
    color: '#2fe1a7',
  },
  {
    id: 'cloud-storage',
    name: 'Cloud Storage',
    category: 'Productivity',
    amount: 12,
    icon: 'CS',
    color: '#60a5fa',
  },
  {
    id: 'music-premium',
    name: 'Music Premium',
    category: 'Audio',
    amount: 15,
    icon: 'MP',
    color: '#34d399',
  },
]

const DEFAULT_CANCELED_IDS = ['streaming-plus', 'gym-elite']
const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1)
const savingsCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

function formatSavingsCurrency(amount: number): string {
  return savingsCurrencyFormatter.format(amount)
}

export function SavingsPage() {
  const [canceledIds, setCanceledIds] = useState<string[]>(DEFAULT_CANCELED_IDS)

  const canceledServices = useMemo(
    () => SERVICES.filter((service) => canceledIds.includes(service.id)),
    [canceledIds],
  )
  const monthlySavings = canceledServices.reduce((sum, service) => sum + service.amount, 0)
  const annualSavings = monthlySavings * 12
  const projection = MONTHS.map((month) => monthlySavings * month)
  const maxProjection = Math.max(...projection, 1)

  function toggleService(id: string) {
    setCanceledIds((current) =>
      current.includes(id)
        ? current.filter((serviceId) => serviceId !== id)
        : [...current, id],
    )
  }

  return (
    <div className="savings-page">
      <header className="savings-page__header">
        <div className="savings-page__intro">
          <h1>Savings Simulation</h1>
          <p>
            Select active subscriptions below to simulate your cumulative annual savings if you
            were to cancel them today.
          </p>
        </div>
      </header>

      <section className="savings-page__service-row" aria-label="Active services">
        <span className="savings-page__service-label">Active Services</span>
        <div className="savings-page__chips">
          {SERVICES.map((service) => {
            const selected = canceledIds.includes(service.id)

            return (
              <button
                key={service.id}
                type="button"
                className={`savings-chip${selected ? ' savings-chip--selected' : ''}`}
                onClick={() => toggleService(service.id)}
                aria-pressed={selected}
              >
                <span className="savings-chip__icon" aria-hidden>
                  {selected ? <IconCheck /> : <IconPlus />}
                </span>
                <span>
                  {service.name} ({formatSavingsCurrency(service.amount)}/mo)
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <div className="savings-page__layout">
        <div className="savings-page__summary">
          <section className="app-card savings-total" aria-label="Total annual savings">
            <p className="savings-total__label">Total Annual Savings</p>
            <p className="savings-total__value">{formatSavingsCurrency(annualSavings)}</p>
            <p className="savings-total__monthly">
              <span aria-hidden>+</span>
              {formatSavingsCurrency(monthlySavings)} / month
            </p>
          </section>

          <section className="app-card canceled-services">
            <h2>Canceled Services</h2>
            {canceledServices.length === 0 ? (
              <p className="canceled-services__empty">
                Select services above to preview your savings.
              </p>
            ) : (
              <ul className="canceled-services__list">
                {canceledServices.map((service) => (
                  <li key={service.id} className="canceled-service">
                    <span
                      className="canceled-service__icon"
                      style={{ background: `${service.color}24`, color: service.color }}
                      aria-hidden
                    >
                      {service.icon}
                    </span>
                    <span className="canceled-service__body">
                      <span className="canceled-service__name">{service.name}</span>
                      <span className="canceled-service__category">{service.category}</span>
                    </span>
                    <span className="canceled-service__price">
                      {formatSavingsCurrency(service.amount)}
                      <small>/ mo</small>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <section className="app-card savings-chart-card">
          <div className="savings-chart-card__head">
            <h2>12-Month Projection</h2>
            <span className="savings-chart-card__legend">
              <span aria-hidden />
              Cumulative Capital
            </span>
          </div>

          <div className="savings-chart" aria-label="12-month cumulative savings chart">
            <div className="savings-chart__title">
              <strong>Savings</strong>
              <span>Projected monthly capital</span>
            </div>
            <div className="savings-chart__plot">
              <div className="savings-chart__grid" aria-hidden>
                {[1, 2, 3, 4, 5].map((line) => (
                  <span key={line} />
                ))}
              </div>
              <div className="savings-chart__bars">
                {projection.map((value, index) => (
                  <span
                    key={MONTHS[index]}
                    className="savings-chart__bar"
                    style={{ height: `${Math.max((value / maxProjection) * 100, 4)}%` }}
                    title={`Month ${MONTHS[index]}: ${formatSavingsCurrency(value)}`}
                  >
                    <span>{formatSavingsCurrency(value)}</span>
                  </span>
                ))}
              </div>
            </div>
            <div className="savings-chart__axis">
              <span>Month 1</span>
              <span>Month 3</span>
              <span>Month 6</span>
              <span>Month 9</span>
              <span>Month 12</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
