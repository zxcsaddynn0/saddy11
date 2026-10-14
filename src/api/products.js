const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

async function request(path, signal) {
  let response
  try {
    response = await fetch(`${API_BASE}/api${path}`, { signal })
  } catch (err) {
    if (err.name === 'AbortError') throw err
    throw new Error('Cannot connect to the backend. Start the API server on port 1452.')
  }
  if (!response.ok) throw new Error(`Backend error: HTTP ${response.status}`)
  const data = await response.json()
  if (data && !Array.isArray(data) && data.message) throw new Error(String(data.message))
  return data
}

export const productsApi = {
  getAll: signal => request('/products/', signal),
  getOne: (id, signal) => request(`/products/${encodeURIComponent(id)}`, signal),
  getCategories: signal => request('/category', signal),
  getCategoryProducts: (id, signal) => request(`/category/${encodeURIComponent(id)}`, signal),
}
