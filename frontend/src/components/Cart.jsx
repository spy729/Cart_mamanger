import React, { useState } from 'react'

function ReceiptModal({ receipt, onClose }) {
  if (!receipt) return null
  const dt = new Date(receipt.timestamp || receipt.createdAt || Date.now())
  const dateStr = dt.toLocaleDateString()
  const timeStr = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Receipt</h3>
        <p>Id: {receipt.id}</p>
        <p className="muted">Date: {dateStr}</p>
        <p className="muted">Time: {timeStr} ({tz})</p>
        <ul>
          {receipt.items.map((it) => (
            <li key={it.productId}>{it.name} x{it.qty} — ${it.lineTotal.toFixed(2)}</li>
          ))}
        </ul>
        <p className="total">Total: ${receipt.total.toFixed(2)}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  )
}

export default function Cart({ cart, onUpdate, onRemove, onCheckout, receipt, onCloseReceipt }) {
  const [editing, setEditing] = useState({})
  const [meta, setMeta] = useState({ name: '', email: '' })

  function setQty(productId, qty) {
    const n = Math.max(0, Number(qty) || 0)
    setEditing((s) => ({ ...s, [productId]: n }))
  }

  function applyUpdate(item) {
    const q = editing[item.productId] ?? item.qty
    if (q <= 0) {
      onRemove(item.id)
    } else {
      onUpdate(item.productId, q)
    }
  }

  function doCheckout(e) {
    e.preventDefault()
    onCheckout(meta)
  }

  return (
    <aside className="cart">
      <h2>Cart</h2>
      {cart.items.length === 0 && <p>Cart is empty</p>}
      <ul>
        {cart.items.map((it) => (
          <li key={it.id} className="cart-item">
            <div>
              <strong>{it.name}</strong>
              <div className="muted">${it.price.toFixed(2)} each</div>
            </div>
            <div className="controls">
              <input type="number" min="0" value={editing[it.productId] ?? it.qty} onChange={(e) => setQty(it.productId, e.target.value)} />
              <button onClick={() => applyUpdate(it)}>Update</button>
              <button className="danger" onClick={() => onRemove(it.id)}>Remove</button>
            </div>
            <div className="line">${it.lineTotal.toFixed(2)}</div>
          </li>
        ))}
      </ul>
      <div className="cart-summary">
        <div>Total: <strong>${cart.total.toFixed(2)}</strong></div>
      </div>

      <form className="checkout" onSubmit={doCheckout}>
        <h3>Checkout</h3>
        <input placeholder="Name" required value={meta.name} onChange={(e) => setMeta({ ...meta, name: e.target.value })} />
        <input placeholder="Email" type="email" required value={meta.email} onChange={(e) => setMeta({ ...meta, email: e.target.value })} />
        <button type="submit" disabled={cart.items.length === 0}>Place order</button>
      </form>

      <ReceiptModal receipt={receipt} onClose={onCloseReceipt} />
    </aside>
  )
}
