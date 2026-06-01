import { FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthFormError } from '../../components/auth/AuthFormError'
import {
  AuthBrand,
  AuthCard,
  AuthCardDivider,
  AuthCardFooter,
  AuthScreen,
  EncryptedFooter,
} from '../../components/auth/AuthScreen'
import { AuthTextField } from '../../components/auth/AuthTextField'
import { IconArrowRight } from '../../components/icons/AuthIcons'
import { ROUTES } from '../../routes'
import {
  getRememberedEmail,
  loginUser,
  setRememberedEmail,
} from '../../utils/authStorage'
import './AuthForm.css'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [formError, setFormError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const saved = getRememberedEmail()
    if (saved) {
      setEmail(saved)
      setRemember(true)
    }
  }, [])

  function validate(): boolean {
    const errors: { email?: string; password?: string } = {}
    if (!email.trim()) errors.email = 'Enter your email or username.'
    if (!password) errors.password = 'Enter your password.'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError('')
    if (!validate()) return

    setLoading(true)
    const result = loginUser(email, password)
    setLoading(false)

    if (!result.ok) {
      setFormError(result.error)
      return
    }

    setRememberedEmail(remember ? email.trim() : null)
    navigate(ROUTES.dashboard, { replace: true })
  }

  return (
    <AuthScreen pageFooter={<EncryptedFooter />}>
      <AuthBrand logo="bank" tagline="Secure Wealth Management" />
      <AuthCard>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {formError && <AuthFormError message={formError} />}

          <AuthTextField
            label="Email or Username"
            name="email"
            type="text"
            autoComplete="username"
            placeholder="Enter your email"
            icon="user"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={fieldErrors.email}
          />

          <AuthTextField
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            icon="lock"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={fieldErrors.password}
          />

          <div className="auth-form__row">
            <label className="auth-form__remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
            <button type="button" className="auth-form__link">
              Forgot password?
            </button>
          </div>

          <button type="submit" className="auth-btn auth-btn--sign-in" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
            {!loading && <IconArrowRight />}
          </button>
        </form>

        <AuthCardDivider />

        <AuthCardFooter>
          New to SaveMammona? <Link to={ROUTES.register}>Create an account</Link>
        </AuthCardFooter>
      </AuthCard>
    </AuthScreen>
  )
}
