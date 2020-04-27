// dependencies
require('dotenv').config()
const express = require('express')
const router = express.Router()
const { param, validationResult } = require('express-validator')

// local files
const apiController = require('./controller')

// routes
router.get('/', (req, res) => {
  console.log(`${req.method} request for ${req.url}.`)

  res.send('Welcome to the API')
})

router.get('/api/trivia/:triviaId', [
  param('triviaId').isLength({ min: 4, max: 4 })
], (req, res, next) => {
  console.log(`${req.method} request for ${req.url}.`)

  try {
    validationResult(req).throw()
    res.send(req.params)
  } catch (validationError) {
    const error = new Error()
    error.statusCode = 422
    error.title = 'API parameter validation failed.'
    error.method = req.method
    error.location = req.url
    error.details = validationError.errors
    return next(error)
  }
})

// 404 handler
router.get('*', (req, res) => {
  console.error(`GET request for nonexistent '${req.path}', resulting in a 404.`)

  res.send('404')
})

module.exports = router
