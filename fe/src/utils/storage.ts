const keyJwt = 'jwt'
const keyRefresh = 'refresh'

const storage = {
  getToken() {
    return JSON.parse(localStorage.getItem(keyJwt) as string)
  },

  setToken(jwtToken: string) {
    localStorage.setItem(keyJwt, JSON.stringify(jwtToken))
  },

  clearToken() {
    localStorage.removeItem(keyJwt)
  },

  getRefresh() {
    return JSON.parse(localStorage.getItem(keyRefresh) as string)
  },

  setRefresh(refreshToken : string) {
    localStorage.setItem(keyRefresh, JSON.stringify(refreshToken))
  },

  clearRefresh() {
    localStorage.removeItem(keyRefresh)
  },

  getItem(key: string) {
    return JSON.parse(localStorage.getItem(key) as string)
  },

  setItem(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value))
  },

  clearItem(key: string) {
    localStorage.removeItem(key)
  },
}

export default storage