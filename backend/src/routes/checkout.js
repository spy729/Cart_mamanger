const express = require('express')
const router = express.Router()
const db = require('../db')

// POST /api/checkout : { cartItems, meta }
router.post('/', async (req, res) => {
  const { cartItems, meta } = req.body
  if (!Array.isArray(cartItems)) return res.status(400).json({ error: 'cartItems array required' })
  const receipt = await db.createReceipt(cartItems, meta)
  await db.clearCart()
  res.json({ ok: true, receipt })
})

module.exports = router
