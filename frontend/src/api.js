const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

function getUserId() {
  try {
    let id = localStorage.getItem('cartUserId')
    if (!id) {
      id = 'u-' + Math.random().toString(36).slice(2, 9)
      localStorage.setItem('cartUserId', id)
    }
    return id
  } catch (e) {
    return 'u-guest'
  }
}

function buildHeaders() {
  return { 'Content-Type': 'application/json', 'x-user-id': getUserId() }
}

export async function fetchProducts() {
  try {
    const res = await fetch(`${BASE}/api/products`)
    if (!res.ok) throw new Error('failed')
    const data = await res.json()
    if (Array.isArray(data) && data.length > 0) return data
  } catch (e) {
    // fall through to return client-side defaults
    console.warn('fetchProducts failed, using defaults', e && e.message)
  }

  // default items to show when backend is not available
  return [
    { id: 'local-p1', name: 'Vibe T-Shirt', price: 19.99 },
    { id: 'local-p2', name: 'Vibe Hoodie', price: 39.99 },
    { id: 'local-p3', name: 'Vibe Cap', price: 14.5 },
    { id: 'local-p4', name: 'Wireless Earbuds', price: 59.99 },
    { id: 'local-p5', name: 'Coffee Mug', price: 9.99 }
  ]
}

export async function createProduct(name, price) {
  const res = await fetch(`${BASE}/api/products`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, price }) })
  return res.json()
}

export async function getCart() {
  const res = await fetch(`${BASE}/api/cart`, { headers: buildHeaders() })
  return res.json()
}

export async function addToCart(productId, qty) {
  const res = await fetch(`${BASE}/api/cart`, { method: 'POST', headers: buildHeaders(), body: JSON.stringify({ productId, qty }) })
  return res.json()
}

export async function removeFromCart(id) {
  const res = await fetch(`${BASE}/api/cart/${id}`, { method: 'DELETE', headers: buildHeaders() })
  return res.json()
}

export async function checkout(cartItems, meta) {
  const res = await fetch(`${BASE}/api/cart/checkout`, { method: 'POST', headers: buildHeaders(), body: JSON.stringify({ cartItems, meta }) })
  return res.json()
}
