export interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

export interface StoredUser extends User {
  passwordHash: string
}

export interface AuthSession {
  userId: string
  email: string
  name: string
}
