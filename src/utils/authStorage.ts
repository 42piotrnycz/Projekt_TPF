const REMEMBER_EMAIL_KEY = 'savemammona_remember_email'

export function getRememberedEmail(): string | null {
  return localStorage.getItem(REMEMBER_EMAIL_KEY)
}

export function setRememberedEmail(email: string | null): void {
  if (email) {
    localStorage.setItem(REMEMBER_EMAIL_KEY, email)
  } else {
    localStorage.removeItem(REMEMBER_EMAIL_KEY)
  }
}
