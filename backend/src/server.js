require('dotenv').config()
const path = require('path')
const db = require('./db')
const app = require('./app')

const PORT = process.env.PORT || 4000

async function start() {
  await db.init()
  app.listen(PORT, () => console.log(`Cart backend running on http://localhost:${PORT}`))
}

if (require.main === module) {
  start().catch((err) => {
    console.error('Failed to start server', err)
    process.exit(1)
  })
}

module.exports = { app, start }
