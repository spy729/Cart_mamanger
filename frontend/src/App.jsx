import React, { useEffect, useState } from 'react'
import { fetchProducts, getCart, addToCart, removeFromCart, checkout, createProduct } from './api'
import ProductList from './components/ProductList'
import Cart from './components/Cart'

export default function App() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState({ items: [], total: 0 })
  const [receipt, setReceipt] = useState(null)
  const [time, setTime] = useState(() => new Date())

  useEffect(() => { loadProducts(); loadCart() }, [])

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  async function loadProducts() {
    const p = await fetchProducts()
    setProducts(p)
  }

  async function handleCreate(name, price) {
    await createProduct(name, price)
    await loadProducts()
  }

  async function loadCart() {
    const c = await getCart()
    setCart(c)
  }

  async function handleAdd(productId) {
    // default qty 1, merge on server
    await addToCart(productId, 1)
    await loadCart()
  }

  async function handleUpdate(productId, qty) {
    await addToCart(productId, qty)
    await loadCart()
  }

  async function handleRemove(id) {
    await removeFromCart(id)
    await loadCart()
  }

  async function handleCheckout(meta) {
    const resp = await checkout(cart.items.map(i => ({ productId: i.productId, qty: i.qty })), meta)
    if (resp && resp.receipt) {
      setReceipt(resp.receipt)
      await loadCart()
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <h1>Vibe Commerce — Cart Manager</h1>
          <div className="time muted">{time.toLocaleTimeString()}</div>
        </div>
      </header>
      <main className="container">
  <ProductList products={products} onAdd={handleAdd} onCreate={handleCreate} />
        <Cart cart={cart} onUpdate={handleUpdate} onRemove={handleRemove} onCheckout={handleCheckout} receipt={receipt} onCloseReceipt={() => setReceipt(null)} />
      </main>
    </div>
  )
}
