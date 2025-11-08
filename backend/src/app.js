const express = require('express')
const cors = require('cors')
const productsRouter = require('./routes/products')
const cartRouter = require('./routes/cart')
const checkoutRouter = require('./routes/checkout')

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/products', productsRouter)
app.use('/api/cart', cartRouter)
app.use('/api/checkout', checkoutRouter)

// health
app.get('/api/ping', (req, res) => res.json({ ok: true }))

module.exports = app
