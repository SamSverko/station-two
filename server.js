// node
const path = require('path')
const httpPost = require('http')
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
const https = require('https').createServer(app)
const io = require('socket.io')(https, { pingTimeout: 10000, pingInterval: 5000 })
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
  let playerName = false
  let playerId = false

  socket.on('joinRoom', (data) => {
    roomCode = data.triviaId
    playerName = data.playerName
    playerId = data.playerId

    console.log(`[SOCKET] ${playerName} joined ${roomCode}`)

    socket.join(roomCode)
    io.to(roomCode).emit('player joined')
  })

  socket.on('displayQuestion', (data) => {
    console.log('[SOCKET - displayQuestion]')
    socket.to(roomCode).emit('display question', data)
  })

  socket.on('playerResponded', (data) => {
    console.log('[SOCKET - playerResponded]')
    socket.to(roomCode).emit('player responded', data)
  })

  socket.on('playerMustWait', (data) => {
    console.log('[SOCKET - playerMustWait]')
    io.to(roomCode).emit('player must wait', data)
  })

  socket.on('disconnect', () => {
    if (playerName && roomCode) {
      console.log(`[SOCKET] ${playerName} left ${roomCode}`)

      const postData = JSON.stringify({
        triviaId: roomCode,
        name: playerName,
        uniqueId: playerId
      })
      const filteredHost = socket.handshake.headers.host.substring(0, socket.handshake.headers.host.indexOf(':'))
      const options = {
        hostname: filteredHost,
        port: 4000,
        path: '/api/v1/leaveLobby',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': postData.length
        }
      }
      const req = httpPost.request(options, (res) => {
        res.on('data', (data) => {
          process.stdout.write(data)
          io.to(roomCode).emit('player left')
        })
        req.on('error', (error) => {
          console.error(error)
        })
      })
      req.write(postData)
      req.end()
    }
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
