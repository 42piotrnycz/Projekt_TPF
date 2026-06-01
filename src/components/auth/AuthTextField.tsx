import { useState, type InputHTMLAttributes } from 'react'
import { IconEye, IconEyeOff, IconLock, IconMail, IconUser } from '../icons/AuthIcons'
import './AuthTextField.css'

type FieldIcon = 'user' | 'mail' | 'lock'

const fieldIcons = {
  user: IconUser,
  mail: IconMail,
  lock: IconLock,
} as const

interface AuthTextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon?: FieldIcon
  error?: string
  hint?: string
  showPasswordToggle?: boolean
}

export function AuthTextField({
  label,
  icon,
  error,
  hint,
  showPasswordToggle = false,
  id,
  type = 'text',
  className = '',
  ...inputProps
}: AuthTextFieldProps) {
  const [visible, setVisible] = useState(false)
  const fieldId = id ?? inputProps.name ?? label.toLowerCase().replace(/\s+/g, '-')
  const isPassword = type === 'password'
  const inputType = isPassword && showPasswordToggle && visible ? 'text' : type
  const Icon = icon ? fieldIcons[icon] : null

  return (
    <div className={`auth-field ${error ? 'auth-field--error' : ''} ${className}`.trim()}>
      <label className="auth-field__label" htmlFor={fieldId}>
        {label}
      </label>
      <div className="auth-field__wrap">
        {Icon && (
          <span className="auth-field__icon">
            <Icon />
          </span>
        )}
        <input
          id={fieldId}
          type={inputType}
          className="auth-field__input"
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined
          }
          {...inputProps}
        />
        {isPassword && showPasswordToggle && (
          <button
            type="button"
            className="auth-field__toggle"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            {visible ? <IconEyeOff /> : <IconEye />}
          </button>
        )}
      </div>
      {hint && !error && (
        <p className="auth-field__hint" id={`${fieldId}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="auth-field__error" id={`${fieldId}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
