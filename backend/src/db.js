const mongoose = require('mongoose')
const Product = require('./models/Product')
const CartItem = require('./models/CartItem')
const Receipt = require('./models/Receipt')

const DEFAULT_PRODUCTS = [
  { name: 'Vibe T-Shirt', price: 19.99 },
  { name: 'Vibe Hoodie', price: 39.99 },
  { name: 'Vibe Cap', price: 14.5 },
  { name: 'Wireless Earbuds', price: 59.99 },
  { name: 'Coffee Mug', price: 9.99 },
  { name: 'Sticker Pack', price: 4.49 },
  { name: 'Notebook', price: 7.25 }
]

async function init() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/cart_manager'
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    console.log('MongoDB connected to', uri)

    // seed products if none exist
    const count = await Product.countDocuments()
    if (count === 0) {
      await Product.insertMany(DEFAULT_PRODUCTS)
      console.log('Seeded default products')
    }
  } catch (err) {
    console.error('Failed to connect to MongoDB', err.message || err)
    throw err
  }
}

async function getProducts() {
  return Product.find().lean()
}

async function addProduct(name, price) {
  const p = new Product({ name, price })
  await p.save()
  return p.toObject()
}

async function getCart(userId) {
  const items = await CartItem.find({ userId }).populate('productId').lean()
  const mapped = items.map((c) => {
    const p = c.productId || { name: 'Unknown', price: 0 }
    const price = p.price || 0
    const lineTotal = Number((price * c.qty).toFixed(2))
    return { id: c._id.toString(), productId: p._id ? p._id.toString() : null, name: p.name, price, qty: c.qty, lineTotal }
  })
  const total = Number(mapped.reduce((s, it) => s + it.lineTotal, 0).toFixed(2))
  return { items: mapped, total }
}

async function addOrUpdateCartItem(productId, qty, userId) {
  if (!userId) throw new Error('userId required')
  // find product by id
  const product = await Product.findById(productId).lean().catch(() => null)
  let prodIdToUse = product ? product._id : productId

  const existing = await CartItem.findOne({ productId: prodIdToUse, userId })
  if (existing) {
    existing.qty = qty
    await existing.save()
  } else {
    const ci = new CartItem({ productId: prodIdToUse, qty, userId })
    await ci.save()
  }
  return getCart(userId)
}

async function removeCartItem(id, userId) {
  await CartItem.deleteOne({ _id: id, userId })
  return getCart(userId)
}

async function clearCart(userId) {
  if (userId) await CartItem.deleteMany({ userId })
  else await CartItem.deleteMany({})
}

async function createReceipt(cartItems, meta = {}) {
  // cartItems: [{ productId, qty }]
  const items = []
  let total = 0
  for (const it of cartItems) {
    let p = null
    try { p = await Product.findById(it.productId).lean() } catch (e) { p = null }
    if (!p) {
      // try by name or skip
      p = { name: 'Unknown', price: 0, _id: null }
    }
    const price = p.price || 0
    const lineTotal = Number((price * (it.qty || 0)).toFixed(2))
    total += lineTotal
    items.push({ productId: p._id ? p._id.toString() : null, name: p.name, price, qty: it.qty, lineTotal })
  }
  total = Number(total.toFixed(2))
  const r = new Receipt({ items, total, meta })
  await r.save()
  const out = r.toObject()
  // add a timestamp field compatible with previous implementation
  out.timestamp = r.createdAt ? r.createdAt.toISOString() : new Date().toISOString()
  return out
}

module.exports = { init, getProducts, addProduct, getCart, addOrUpdateCartItem, removeCartItem, clearCart, createReceipt }
