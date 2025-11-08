const express = require('express')
const router = express.Router()
const db = require('../db')

// Get cart with joined product data and total
router.get('/', async (req, res) => {
  try {
    const userId = req.header('x-user-id') || req.query.userId
    if (!userId) return res.status(400).json({ error: 'x-user-id header required' })
    const cart = await db.getCart(userId)
    const products = await db.getProducts()
    res.json(cart)
  } catch (err) {
    console.error('GET /api/cart error', err)
    res.status(500).json({ error: 'failed to fetch cart' })
  }
})

// Add or update cart item: { productId, qty }
router.post('/', async (req, res) => {
  try {
    const { productId, qty } = req.body
    const userId = req.header('x-user-id') || req.query.userId
    if (!userId) return res.status(400).json({ error: 'x-user-id header required' })
    if (!productId || typeof qty !== 'number') return res.status(400).json({ error: 'productId and numeric qty required' })
    const cart = await db.addOrUpdateCartItem(productId, qty, userId)
    res.json({ ok: true, cart })
  } catch (err) {
    console.error('POST /api/cart error', err)
    res.status(500).json({ error: 'failed to add/update cart item' })
  }
})

// Remove item
router.delete('/:id', async (req, res) => {
  const id = req.params.id
  const userId = req.header('x-user-id') || req.query.userId
  if (!userId) return res.status(400).json({ error: 'x-user-id header required' })
  await db.removeCartItem(id, userId)
  res.json({ ok: true })
})

// Checkout: accept cartItems and optional meta { name, email }
router.post('/checkout', async (req, res) => {
  try {
    const { cartItems, meta } = req.body
    const userId = req.header('x-user-id') || req.query.userId
    if (!userId) return res.status(400).json({ error: 'x-user-id header required' })
    if (!Array.isArray(cartItems)) return res.status(400).json({ error: 'cartItems array required' })
    const receipt = await db.createReceipt(cartItems, meta)
    // clear cart after checkout for this user
    await db.clearCart(userId)
    res.json({ ok: true, receipt })
  } catch (err) {
    console.error('POST /api/cart/checkout error', err)
    res.status(500).json({ error: 'failed to checkout' })
  }
})

module.exports = router
