export function setToken(token: string) {
  localStorage.setItem('token', token)
}

export function getToken(): string | null {
  return localStorage.getItem('token')
}

export function removeToken() {
  localStorage.removeItem('token')
}

export function setRefreshToken(refreshToken: string) {
  localStorage.setItem('refreshToken', refreshToken)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem('refreshToken')
}

export function removeRefreshToken() {
  localStorage.removeItem('refreshToken')
}
