const mongoose = require('mongoose')

const ReceiptItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  price: Number,
  qty: Number,
  lineTotal: Number
}, { _id: false })

const ReceiptSchema = new mongoose.Schema({
  items: [ReceiptItemSchema],
  total: Number,
  meta: { type: Object, default: {} }
}, { timestamps: true })

module.exports = mongoose.model('Receipt', ReceiptSchema)
