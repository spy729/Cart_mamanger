const request = require('supertest')
const { app } = require('../src/server')
const db = require('../src/db')

const TEST_USER = 'test-user-1'

beforeAll(async () => {
  await db.init()
  await db.clearCart(TEST_USER)
})

afterAll(async () => {
  // ensure cart cleared
  await db.clearCart(TEST_USER)
})

test('GET /api/products returns seeded products', async () => {
  const res = await request(app).get('/api/products')
  expect(res.status).toBe(200)
  expect(Array.isArray(res.body)).toBe(true)
  expect(res.body.length).toBeGreaterThanOrEqual(5)
  expect(res.body[0]).toHaveProperty('_id')
  expect(res.body[0]).toHaveProperty('name')
  expect(res.body[0]).toHaveProperty('price')
})

test('cart flow: add, get, checkout', async () => {
  // find a product to add
  const products = (await request(app).get('/api/products')).body
  const prod = products[0]
  expect(prod).toBeTruthy()
  const pid = prod._id || prod.id

  // add item
  const add = await request(app).post('/api/cart').set('x-user-id', TEST_USER).send({ productId: pid, qty: 2 })
  expect(add.status).toBe(200)
  expect(add.body).toHaveProperty('ok', true)

  // get cart
  const cartRes = await request(app).get('/api/cart').set('x-user-id', TEST_USER)
  expect(cartRes.status).toBe(200)
  expect(Array.isArray(cartRes.body.items)).toBe(true)
  expect(cartRes.body.items.length).toBeGreaterThanOrEqual(1)
  const item = cartRes.body.items.find((i) => i.productId === (pid.toString ? pid.toString() : pid))
  expect(item).toBeTruthy()
  expect(item.qty).toBe(2)

  // checkout
  const resp = await request(app).post('/api/cart/checkout').set('x-user-id', TEST_USER).send({ cartItems: [{ productId: pid, qty: 2 }], meta: { name: 'Test', email: 'a@b.com' } })
  expect(resp.status).toBe(200)
  expect(resp.body).toHaveProperty('ok', true)
  expect(resp.body).toHaveProperty('receipt')
  expect(resp.body.receipt).toHaveProperty('total')

  // cart should be cleared after checkout
  const after = await request(app).get('/api/cart').set('x-user-id', TEST_USER)
  expect(after.status).toBe(200)
  expect(after.body.items.length).toBe(0)
})
