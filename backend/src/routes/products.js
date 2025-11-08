const express = require('express')
const router = express.Router()
const db = require('../db')

router.get('/', async (req, res) => {
  try {
    const products = await db.getProducts()
    // normalize _id to id for compatibility with frontend
    const mapped = products.map((p) => ({ id: p._id ? p._id.toString() : p.id, name: p.name, price: p.price }))
    res.json(mapped)
  } catch (err) {
    console.error('GET /api/products error', err)
    res.status(500).json({ error: 'failed to fetch products' })
  }
})

// Add product (simple admin endpoint)
router.post('/', async (req, res) => {
  try {
    const { name, price } = req.body
    if (!name || typeof price === 'undefined' || isNaN(Number(price))) return res.status(400).json({ error: 'name and numeric price required' })
    const p = await db.addProduct(name, Number(price))
    res.status(201).json({ id: p._id ? p._id.toString() : p.id, name: p.name, price: p.price })
  } catch (err) {
    console.error('POST /api/products error', err)
    res.status(500).json({ error: 'failed to create product' })
  }
})

module.exports = router
