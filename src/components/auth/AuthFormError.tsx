interface AuthFormErrorProps {
  message: string
}

export function AuthFormError({ message }: AuthFormErrorProps) {
  return (
    <div className="auth-form__banner auth-form__banner--error" role="alert">
      {message}
    </div>
  )
}
