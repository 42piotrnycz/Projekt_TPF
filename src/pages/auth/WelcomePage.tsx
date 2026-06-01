import { Link } from 'react-router-dom'
import {
  AuthBrand,
  AuthCard,
  AuthScreen,
  EncryptedFooter,
} from '../../components/auth/AuthScreen'
import { IconArrowRight } from '../../components/icons/AuthIcons'
import { ROUTES } from '../../routes'
import './AuthForm.css'

export function WelcomePage() {
  return (
    <AuthScreen pageFooter={<EncryptedFooter />}>
      <AuthBrand logo="bank" tagline="Secure Wealth Management" />
      <AuthCard>
        <p className="auth-lead">
          Track spending, plan your budget, and keep your finances under control — all in one
          place.
        </p>
        <div className="stack stack--actions">
          <Link to={ROUTES.login} className="auth-btn auth-btn--sign-in">
            Sign In
            <IconArrowRight />
          </Link>
          <Link to={ROUTES.register} className="auth-btn auth-btn--outline">
            Create an account
          </Link>
        </div>
      </AuthCard>
    </AuthScreen>
  )
}
