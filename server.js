// node
const path = require('path')
const bodyParser = require('body-parser')

// dependencies
require('dotenv').config()
const HOST = process.env.APP_HOST || 'localhost'
const PORT = process.env.APP_PORT || 4000
const DB_NAME = process.env.DB_NAME
const DB_URL = process.env.DB_URL
const express = require('express')
const app = express()
const helmet = require('helmet')
const cors = require('cors')
// const http = require('http').createServer(app)
// const io = require('socket.io')(http, { pingTimeout: 10000, pingInterval: 5000 })
const compression = require('compression')
const MongoClient = require('mongodb').MongoClient

// local files
const router = require(path.join(__dirname, './api/routes'))

// helmet and cors
app.use(helmet())
app.use(cors())

// enable gzip compression, urlencoded (for form submits), and bodyParser for JSON posts
app.use(compression())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())

// database connection
MongoClient.connect(DB_URL, {
  poolSize: 25,
  useUnifiedTopology: true,
  wtimeout: 2500
})
  .catch(error => {
    console.log(error.stack)
    process.exit(1)
  })
  .then(async client => {
    app.db = client.db(DB_NAME)
  })

// routes
app.use('/', router)

// server error handler
app.use((error, req, res, next) => {
  if (!error.statusCode) error.statusCode = 500
  // console.error(error)
  res.send(error)
})

// app graceful stop
process.on('SIGINT', function () {
  console.log('SIGINT')
  process.exit(0)
})

// turn app listening on
app.listen(PORT, () => {
  console.log(`Server successfully started app, listening at ${HOST}:${PORT}.`)
})
