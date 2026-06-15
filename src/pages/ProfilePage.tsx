import { FormEvent, useState } from 'react'
import {
  IconCheck,
  IconUser,
} from '../components/icons/AppIcons'
import { useAuth } from '../hooks/useAuth'
import './ProfilePage.css'

type SecurityAction = {
  key: 'name' | 'password' | 'twoFactor'
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
  { key: 'name', label: 'Change Name', icon: 'ID' },
  { key: 'password', label: 'Change Password', icon: 'PW' },
  { key: 'twoFactor', label: 'Two-Factor Authentication', icon: '2F', status: 'Enabled' },
]

const PREFERENCES: Preference[] = [
  { label: 'Appearance', icon: 'DM', control: 'toggle', helper: 'Dark Mode' },
  { label: 'Language', icon: 'LN', control: 'language' },
  { label: 'Base Currency', icon: 'BC', control: 'currency' },
]

export function ProfilePage() {
  const { user } = useAuth()
  const [activePanel, setActivePanel] = useState<SecurityAction['key'] | null>(null)
  const [profileName, setProfileName] = useState(user?.displayName ?? 'Alexander Wright')
  const [email, setEmail] = useState(user?.email ?? 'alexander@savemammona.app')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [securityMessage, setSecurityMessage] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [darkMode, setDarkMode] = useState(true)
  const [language, setLanguage] = useState('English (US)')
  const [currency, setCurrency] = useState('PLN (zl)')

  function handleProfileSubmit(e: FormEvent) {
    e.preventDefault()
    setSecurityMessage('Profile details saved locally for this mockup.')
  }

  function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault()
    if (!currentPassword || !newPassword || newPassword !== confirmPassword) {
      setPasswordMessage('Check password fields before saving.')
      return
    }
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setPasswordMessage('Password change mocked successfully.')
  }

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
                <button
                  type="button"
                  className="profile-list__button"
                  onClick={() => setActivePanel(action.key)}
                >
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
                      className={`profile-toggle${darkMode ? ' profile-toggle--on' : ''}`}
                      aria-label="Toggle dark mode"
                      role="switch"
                      aria-checked={darkMode}
                      onClick={() => setDarkMode((value) => !value)}
                    >
                      <span />
                    </button>
                  )}
                  {preference.control === 'language' && (
                    <select
                      className="profile-select"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      aria-label="Language"
                    >
                      <option>English (US)</option>
                      <option>Polski</option>
                      <option>Deutsch</option>
                    </select>
                  )}
                  {preference.control === 'currency' && (
                    <select
                      className="profile-select"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      aria-label="Base currency"
                    >
                      <option>PLN (zl)</option>
                      <option>EUR</option>
                      <option>USD</option>
                    </select>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {activePanel === 'name' && (
        <section className="app-card profile-detail-panel">
          <div className="profile-detail-panel__head">
            <div>
              <h2>Change Name</h2>
              <p>Mockup form for profile identity details.</p>
            </div>
            <button
              type="button"
              className="app-btn app-btn--ghost app-btn--sm"
              onClick={() => setActivePanel(null)}
            >
              Close
            </button>
          </div>
          <form className="profile-form" onSubmit={handleProfileSubmit}>
            <div className="profile-form__two-col">
              <label className="profile-field">
                <span>Display name</span>
                <input
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="Your name"
                />
              </label>
              <label className="profile-field">
                <span>Email address</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </label>
            </div>
            <button type="submit" className="app-btn app-btn--primary profile-form__submit">
              Save Profile
            </button>
            {securityMessage && <p className="profile-form__message">{securityMessage}</p>}
          </form>
        </section>
      )}

      {activePanel === 'password' && (
        <section className="app-card profile-detail-panel">
          <div className="profile-detail-panel__head">
            <div>
              <h2>Change Password</h2>
              <p>Mockup form for account password updates.</p>
            </div>
            <button
              type="button"
              className="app-btn app-btn--ghost app-btn--sm"
              onClick={() => setActivePanel(null)}
            >
              Close
            </button>
          </div>
          <form className="profile-form" onSubmit={handlePasswordSubmit}>
            <div className="profile-form__password-grid">
              <label className="profile-field">
                <span>Current password</span>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Current password"
                />
              </label>
              <label className="profile-field">
                <span>New password</span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
                />
              </label>
              <label className="profile-field">
                <span>Confirm password</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                />
              </label>
            </div>
            <button type="submit" className="app-btn app-btn--primary profile-form__submit">
              Update Password
            </button>
            {passwordMessage && <p className="profile-form__message">{passwordMessage}</p>}
          </form>
        </section>
      )}

      {activePanel === 'twoFactor' && (
        <section className="app-card profile-detail-panel">
          <div className="profile-detail-panel__head">
            <div>
              <h2>Two-Factor Authentication</h2>
              <p>Two-factor authentication is enabled in this mock profile.</p>
            </div>
            <button
              type="button"
              className="app-btn app-btn--ghost app-btn--sm"
              onClick={() => setActivePanel(null)}
            >
              Close
            </button>
          </div>
          <div className="profile-detail-panel__status">
            <span className="profile-list__status">Enabled</span>
            <p>Future implementation can connect this panel to an authenticator setup flow.</p>
          </div>
        </section>
      )}

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
