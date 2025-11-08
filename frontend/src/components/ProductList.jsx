import React, { useState } from 'react'

export default function ProductList({ products, onAdd, onCreate }) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')

  async function submit(e) {
    e.preventDefault()
    if (!name || !price) return
    const p = Number(price)
    if (isNaN(p)) return
    await onCreate?.(name, p)
    setName('')
    setPrice('')
  }

  return (
    <section className="products flex-1">
      <h2 className="text-text text-lg font-semibold mb-3">Products</h2>

      {onCreate && (
        <form className="product-card mb-3 flex gap-2 items-center" onSubmit={submit}>
          <input className="flex-1 bg-transparent border border-[rgba(255,255,255,0.04)] rounded-md px-3 py-2 text-text" placeholder="Product name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="w-28 bg-transparent border border-[rgba(255,255,255,0.04)] rounded-md px-3 py-2 text-text" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
          <button className="px-3 py-2 rounded-md font-semibold bg-gradient-to-r from-accent to-accent2 text-[#02121a]" type="submit">Add</button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {products.map((p) => (
          <div key={p.id} className="product-card">
            <div>
              <h3 className="text-text text-sm font-semibold">{p.name}</h3>
              <p className="text-muted text-sm mt-1">${Number(p.price).toFixed(2)}</p>
              <div className="mt-3">
                <button className="px-3 py-2 rounded-md font-semibold bg-gradient-to-r from-accent to-accent2 text-[#02121a]" onClick={() => onAdd(p.id)}>Add to cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
