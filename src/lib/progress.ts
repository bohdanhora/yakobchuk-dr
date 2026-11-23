const SOLVED_KEY = 'yakobchuk-dr:puzzle-solved'
const params = new URLSearchParams(window.location.search)
const testMode = params.has('test')

export function readSolved() {
  if (testMode) return false
  try {
    if (params.has('reset-puzzle')) {
      localStorage.removeItem(SOLVED_KEY)
      return false
    }
    return localStorage.getItem(SOLVED_KEY) === '1'
  } catch {
    return false
  }
}

export function saveSolved() {
  if (testMode) return
  try {
    localStorage.setItem(SOLVED_KEY, '1')
  } catch {
    return
  }
}
