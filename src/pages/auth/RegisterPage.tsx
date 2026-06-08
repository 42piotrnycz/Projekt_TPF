import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { AuthFormError } from '../../components/auth/AuthFormError'
import {
  AuthBrand,
  AuthCard,
  AuthCardFooter,
  AuthScreen,
  TrustBadges,
} from '../../components/auth/AuthScreen'
import { AuthTextField } from '../../components/auth/AuthTextField'
import { ROUTES } from '../../routes'
import { auth } from '../../lib/firebase'
import { firebaseErrorMessage } from '../../utils/firebaseErrors'
import { isValidEmail, MIN_PASSWORD_LENGTH } from '../../utils/validation'
import './AuthForm.css'

export function RegisterPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [formError, setFormError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  function validate(): boolean {
    const errors: Record<string, string> = {}
    if (!name.trim()) errors.name = 'Enter your full name.'
    if (!email.trim()) errors.email = 'Enter your email address.'
    else if (!isValidEmail(email)) errors.email = 'Invalid email format.'
    if (!password) errors.password = 'Enter your password.'
    else if (password.length < MIN_PASSWORD_LENGTH) {
      errors.password = `Must be at least ${MIN_PASSWORD_LENGTH} characters.`
    }
    if (!acceptedTerms) errors.terms = 'You must accept the terms to continue.'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError('')
    if (!validate()) return

    setLoading(true)
    try {
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password)
      await updateProfile(credential.user, { displayName: name.trim() })
      navigate(ROUTES.dashboard, { replace: true })
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? ''
      setFormError(firebaseErrorMessage(code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthScreen pageFooter={<TrustBadges />}>
      <AuthBrand logo="piggy" tagline="Start your journey to financial freedom" />
      <AuthCard glow>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {formError && <AuthFormError message={formError} />}

          <AuthTextField
            label="Full Name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="John Doe"
            icon="user"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={fieldErrors.name}
          />

          <AuthTextField
            label="Email Address"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            icon="mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={fieldErrors.email}
          />

          <AuthTextField
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            icon="lock"
            showPasswordToggle
            hint={
              fieldErrors.password
                ? undefined
                : `Must be at least ${MIN_PASSWORD_LENGTH} characters`
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={fieldErrors.password}
          />

          <div className="auth-form__terms-group">
            <label className="auth-form__terms">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
              />
              <span>
                I agree to the{' '}
                <button type="button" className="auth-form__terms-link">
                  Terms of Service
                </button>{' '}
                and{' '}
                <button type="button" className="auth-form__terms-link">
                  Privacy Policy
                </button>
              </span>
            </label>
            {fieldErrors.terms && (
              <p className="auth-field__error" role="alert">
                {fieldErrors.terms}
              </p>
            )}
          </div>

          <button type="submit" className="auth-btn auth-btn--sign-up" disabled={loading}>
            {loading ? 'Creating account…' : 'Sign Up'}
          </button>
        </form>

        <AuthCardFooter>
          Already have an account? <Link to={ROUTES.login}>Login</Link>
        </AuthCardFooter>
      </AuthCard>
    </AuthScreen>
  )
}
