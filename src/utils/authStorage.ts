import type { AuthSession, StoredUser, User } from '../types/user'
import { DEMO_USER } from './demoUser'

const USERS_KEY = 'savemammona_users'
const SESSION_KEY = 'savemammona_session'
const REMEMBER_EMAIL_KEY = 'savemammona_remember_email'

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as StoredUser[]) : []
  } catch {
    return []
  }
}

function writeUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function hashPassword(password: string): string {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    hash = (hash << 5) - hash + password.charCodeAt(i)
    hash |= 0
  }
  return `demo_${hash.toString(16)}`
}

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

export function registerUser(
  name: string,
  email: string,
  password: string,
): { ok: true; user: User } | { ok: false; error: string } {
  const normalizedEmail = email.trim().toLowerCase()
  const users = readUsers()

  if (users.some((u) => u.email === normalizedEmail)) {
    return { ok: false, error: 'An account with this email already exists.' }
  }

  const user: StoredUser = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  }

  writeUsers([...users, user])

  return {
    ok: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
  }
}

export function loginUser(
  email: string,
  password: string,
): { ok: true; session: AuthSession } | { ok: false; error: string } {
  const normalizedEmail = email.trim().toLowerCase()
  const user = readUsers().find((u) => u.email === normalizedEmail)

  if (!user || user.passwordHash !== hashPassword(password)) {
    return { ok: false, error: 'Invalid email or password.' }
  }

  const session: AuthSession = {
    userId: user.id,
    email: user.email,
    name: user.name,
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return { ok: true, session }
}

export function registerAndLogin(
  name: string,
  email: string,
  password: string,
): { ok: true; session: AuthSession } | { ok: false; error: string } {
  const registered = registerUser(name, email, password)
  if (!registered.ok) return registered
  return loginUser(email, password)
}

export function getSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthSession
  } catch {
    return null
  }
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY)
}

export function ensureDemoUser(): void {
  const users = readUsers()
  if (users.some((u) => u.email === DEMO_USER.email)) return

  const user: StoredUser = {
    id: crypto.randomUUID(),
    name: DEMO_USER.name,
    email: DEMO_USER.email,
    passwordHash: hashPassword(DEMO_USER.password),
    createdAt: new Date().toISOString(),
  }

  writeUsers([...users, user])
}
