// node
const path = require('path')
const bodyParser = require('body-parser')

// dependencies
require('dotenv').config()
const HOST = process.env.APP_HOST || 'localhost'
const PORT = process.env.APP_PORT || 4000
const express = require('express')
const app = express()
const helmet = require('helmet')
const cors = require('cors')
const http = require('http').createServer(app)
const io = require('socket.io')(http, { pingTimeout: 10000, pingInterval: 5000 })
const compression = require('compression')
const mongoSanitize = require('express-mongo-sanitize')
const MongoClient = require('mongodb').MongoClient

// local files
const router = require(path.join(__dirname, './api/routes'))

// helmet, cors, and mongoSanitize
app.use(helmet())
app.use(cors())
app.use(mongoSanitize())

// enable gzip compression, urlencoded (for form submits), and bodyParser for JSON posts
app.use(compression())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())

// web socket
// ROOMS: socket.to = send to all but not sender | io.to = send to all including sender
// NO ROOMS: io.emit = send to all including sender | socket.emit = send to sender only | socket.broadcast.emit = send to all but not sender
io.on('connection', (socket) => {
  let roomCode = false
  socket.on('joinRoom', (data) => {
    roomCode = data
    socket.join(roomCode)
    console.log('[SOCKET] player joined.')
    socket.to(roomCode).emit('player joined')
  })

  socket.on('button test', (data) => {
    // console.log(`[SOCKET] ${roomCode}`)
    socket.to(roomCode).emit('button test', data)
  })

  socket.on('disconnect', (data) => {
    console.log('[SOCKET] player left.')
  })
})

// database connection
MongoClient.connect(process.env.DB_URL, {
  poolSize: 25,
  useUnifiedTopology: true,
  wtimeout: 2500
})
  .catch(error => {
    console.log(error.stack)
    process.exit(1)
  })
  .then(async client => {
    app.db = client.db(process.env.DB_NAME)
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
http.listen(PORT, () => {
  console.log(`Server successfully started app, listening at ${HOST}:${PORT}.`)
})
