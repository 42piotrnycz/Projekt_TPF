import type { ReactNode } from 'react'
import { IconBank, IconPiggy, IconShield, IconShieldCheck } from '../icons/AuthIcons'
import './AuthScreen.css'

export type AuthLogoVariant = 'bank' | 'piggy'

interface AuthScreenProps {
  children: ReactNode
  pageFooter?: ReactNode
}

export function AuthScreen({ children, pageFooter }: AuthScreenProps) {
  return (
    <div className="auth-screen">
      <div className="auth-screen__bg" aria-hidden />
      <div className="auth-screen__inner stack stack--page">
        {children}
        {pageFooter && <div className="auth-screen__page-footer">{pageFooter}</div>}
      </div>
    </div>
  )
}

interface AuthBrandProps {
  logo: AuthLogoVariant
  tagline: string
}

export function AuthBrand({ logo, tagline }: AuthBrandProps) {
  return (
    <div className="auth-brand stack stack--center stack--brand">
      <div className={`auth-brand__logo auth-brand__logo--${logo}`}>
        {logo === 'bank' ? <IconBank /> : <IconPiggy />}
      </div>
      <h1 className="auth-brand__title">SaveMammona</h1>
      <p className="auth-brand__tagline">{tagline}</p>
    </div>
  )
}

interface AuthCardProps {
  children: ReactNode
  glow?: boolean
}

export function AuthCard({ children, glow = false }: AuthCardProps) {
  return (
    <div className={`auth-card stack stack--card ${glow ? 'auth-card--glow' : ''}`}>
      {children}
    </div>
  )
}

export function AuthCardDivider() {
  return <hr className="auth-card__divider" />
}

interface AuthCardFooterProps {
  children: ReactNode
}

export function AuthCardFooter({ children }: AuthCardFooterProps) {
  return <p className="auth-card__footer">{children}</p>
}

export function EncryptedFooter() {
  return (
    <p className="auth-encrypted-footer">
      <IconShield />
      End-to-end encrypted connection
    </p>
  )
}

export function TrustBadges() {
  return (
    <ul className="auth-trust">
      <li>
        <span className="auth-trust__icon">
          <IconShieldCheck />
        </span>
        Secure
      </li>
      <li>
        <span className="auth-trust__icon">
          <IconShield />
        </span>
        Encrypted
      </li>
      <li>
        <span className="auth-trust__icon">
          <IconBank />
        </span>
        Trusted
      </li>
    </ul>
  )
}
