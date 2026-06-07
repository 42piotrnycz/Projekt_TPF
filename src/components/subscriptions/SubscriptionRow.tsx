import { CATEGORY_LABELS } from '../../types/subscription'
import type { Subscription } from '../../types/subscription'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatRenewalDate } from '../../utils/dateLabels'
import { IconMore } from '../icons/AppIcons'
import './SubscriptionRow.css'

interface SubscriptionRowProps {
  subscription: Subscription
  onToggle: (id: string) => void
}

export function SubscriptionRow({ subscription, onToggle }: SubscriptionRowProps) {
  const initial = subscription.name.charAt(0).toUpperCase()

  return (
    <article className="sub-row">
      <div className="sub-row__main">
        <div
          className="service-icon"
          style={{ background: subscription.iconColor }}
          aria-hidden
        >
          {initial}
        </div>
        <div className="sub-row__info">
          <div className="sub-row__title-row">
            <h3 className="sub-row__name">{subscription.name}</h3>
            <span className={`badge badge--${subscription.status}`}>
              {subscription.status === 'active' ? 'Active' : 'Paused'}
            </span>
          </div>
          <p className="sub-row__meta">
            {CATEGORY_LABELS[subscription.category]} • Renews {formatRenewalDate(subscription.renewalDate)}
          </p>
        </div>
      </div>

      <div className="sub-row__aside">
        <div className="sub-row__price">
          <span className="sub-row__amount">{formatCurrency(subscription.amount)}</span>
          <span className="sub-row__cycle">Monthly</span>
        </div>
        <button
          type="button"
          className={`toggle${subscription.status === 'active' ? ' toggle--on' : ''}`}
          onClick={() => onToggle(subscription.id)}
          aria-label={`Toggle ${subscription.name}`}
        >
          <span className="toggle__knob" />
        </button>
        <button type="button" className="sub-row__more" aria-label="More options">
          <IconMore />
        </button>
      </div>
    </article>
  )
}
