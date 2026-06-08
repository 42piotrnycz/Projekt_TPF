import {
  IconCheck,
  IconUser,
} from '../components/icons/AppIcons'
import { useAuth } from '../context/AuthContext'
import './ProfilePage.css'

type SecurityAction = {
  label: string
  icon: string
  status?: string
}

type Preference = {
  label: string
  icon: string
  control: 'toggle' | 'language' | 'currency'
  helper?: string
}

const SECURITY_ACTIONS: SecurityAction[] = [
  { label: 'Change Name', icon: 'ID' },
  { label: 'Change Password', icon: 'PW' },
  { label: 'Two-Factor Authentication', icon: '2F', status: 'Enabled' },
]

const PREFERENCES: Preference[] = [
  { label: 'Appearance', icon: 'DM', control: 'toggle', helper: 'Dark Mode' },
  { label: 'Language', icon: 'LN', control: 'language' },
  { label: 'Base Currency', icon: 'BC', control: 'currency' },
]

export function ProfilePage() {
  const { user } = useAuth()
  const profileName = user?.displayName ?? 'Alexander Wright'

  return (
    <div className="profile-page">
      <section className="profile-hero">
        <div className="profile-avatar">
          <div className="profile-avatar__face" aria-hidden>
            <span className="profile-avatar__hair profile-avatar__hair--left" />
            <span className="profile-avatar__hair profile-avatar__hair--right" />
            <span className="profile-avatar__eye profile-avatar__eye--left" />
            <span className="profile-avatar__eye profile-avatar__eye--right" />
            <span className="profile-avatar__nose" />
            <span className="profile-avatar__smile" />
          </div>
          <span className="profile-avatar__shirt" />
          <button type="button" className="profile-avatar__edit" aria-label="Edit profile photo">
            <IconUser />
          </button>
        </div>

        <h1>{profileName}</h1>
        <p>Premium Investor</p>
        <span className="profile-hero__badge">
          <IconCheck />
          Identity Verified
        </span>
      </section>

      <div className="profile-page__grid">
        <section className="app-card profile-panel">
          <h2>
            <span className="profile-panel__icon" aria-hidden>
              AS
            </span>
            Account Security
          </h2>

          <div className="profile-panel__divider" />

          <ul className="profile-list">
            {SECURITY_ACTIONS.map((action) => (
              <li key={action.label}>
                <button type="button" className="profile-list__button">
                  <span className="profile-list__icon" aria-hidden>
                    {action.icon}
                  </span>
                  <span className="profile-list__label">{action.label}</span>
                  {action.status && <span className="profile-list__status">{action.status}</span>}
                  <span className="profile-list__chevron" aria-hidden>
                    &gt;
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="app-card profile-panel">
          <h2>
            <span className="profile-panel__icon profile-panel__icon--warm" aria-hidden>
              PF
            </span>
            Preferences
          </h2>

          <div className="profile-panel__divider" />

          <ul className="profile-list profile-list--preferences">
            {PREFERENCES.map((preference) => (
              <li key={preference.label}>
                <div className="profile-list__button profile-list__button--static">
                  <span className="profile-list__icon" aria-hidden>
                    {preference.icon}
                  </span>
                  <span className="profile-list__label">
                    {preference.label}
                    {preference.helper && <small>{preference.helper}</small>}
                  </span>
                  {preference.control === 'toggle' && (
                    <button
                      type="button"
                      className="profile-toggle"
                      aria-label="Dark mode enabled"
                      role="switch"
                      aria-checked="true"
                    >
                      <span />
                    </button>
                  )}
                  {preference.control === 'language' && (
                    <button type="button" className="profile-select">
                      English (US)
                      <span aria-hidden>v</span>
                    </button>
                  )}
                  {preference.control === 'currency' && (
                    <button type="button" className="profile-select">
                      USD ($)
                      <span aria-hidden>v</span>
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="app-card danger-zone">
        <div>
          <h2>
            <span aria-hidden>!</span>
            Danger Zone
          </h2>
          <p>
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
        </div>
        <button type="button">Delete Account</button>
      </section>
    </div>
  )
}
