export function readStored(key, fallback) {
  try {
    const data = JSON.parse(localStorage.getItem(key) || 'null')
    return data ?? fallback
  } catch { return fallback }
}
export function writeStored(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)) } catch {  }
}
