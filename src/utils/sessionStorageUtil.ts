export default {
  setItem(key: string, value: any) {
    sessionStorage.setItem(key, JSON.stringify(value))
  },

  getItem(key: string): any {
    const value: any = sessionStorage.getItem(key)
    return JSON.parse(value)
  }
}
