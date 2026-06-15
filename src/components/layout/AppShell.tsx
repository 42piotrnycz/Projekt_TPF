import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import {
  IconCalendar,
  IconHome,
  IconLayers,
  IconPiggy,
  IconUser,
} from '../icons/AppIcons'
import { ROUTES } from '../../routes'
import { auth } from '../../lib/firebase'
import { useAuth } from '../../context/AuthContext'
import './AppShell.css'

const navItems: {
  to: string
  label: string
  icon: typeof IconHome
  disabled?: boolean
}[] = [
    { to: ROUTES.dashboard, label: 'Home', icon: IconHome },
    { to: ROUTES.subscriptions, label: 'Subscriptions', icon: IconLayers },
    { to: ROUTES.calendar, label: 'Calendar', icon: IconCalendar },
    { to: ROUTES.savings, label: 'Savings', icon: IconPiggy },
    { to: ROUTES.profile, label: 'Profile', icon: IconUser },
  ]

export function AppShell() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const displayName = user?.displayName ?? user?.email ?? 'User'
  const avatarLetter = displayName.charAt(0).toUpperCase()

  async function handleLogout() {
    await signOut(auth)
    navigate(ROUTES.welcome, { replace: true })
  }

  return (
    <div className="app-shell">
      <aside className="app-shell__sidebar">
        <div className="app-shell__brand">
          <span className="app-shell__brand-name">SaveMammona</span>
          <span className="app-shell__brand-tag">Wealth Management</span>
        </div>

        <nav className="app-shell__nav" aria-label="Main navigation">
          {navItems.map(({ to, label, icon: Icon, disabled }) =>
            disabled ? (
              <span key={label} className="app-shell__nav-link app-shell__nav-link--disabled">
                <Icon />
                {label}
              </span>
            ) : (
              <NavLink
                key={label}
                to={to}
                end={to === ROUTES.dashboard}
                className={({ isActive }) =>
                  `app-shell__nav-link${isActive ? ' app-shell__nav-link--active' : ''}`
                }
              >
                <Icon />
                {label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="app-shell__user">
          <div className="app-shell__avatar" aria-hidden>
            {avatarLetter}
          </div>
          <div className="app-shell__user-info">
            <span className="app-shell__user-name">{displayName}</span>
            <span className="app-shell__user-plan">Pro Plan</span>
          </div>
          <button type="button" className="app-shell__logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="app-shell__content">
        <Outlet />
      </main>
    </div>
  )
}
