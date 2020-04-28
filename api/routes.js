// dependencies
require('dotenv').config()
const API_VERSION = process.env.API_VERSION || 1
const express = require('express')
const router = express.Router()
const { param, query, validationResult } = require('express-validator')

// local files
const apiController = require('./controller')

// routes
router.get('/', (req, res) => {
  console.log(`${req.method} request for ${req.url}.`)

  res.send('Welcome to the API')
})

router.get(`/api/v${API_VERSION}/:collection/:triviaId`, [
  param('collection').isString().trim().escape().isIn([process.env.DB_COLLECTION_TRIVIA, process.env.DB_COLLECTION_LOBBIES]),
  param('triviaId').isString().trim().escape().isLength({ min: 4, max: 4 }),
  query('roundNumber').trim().escape().toInt().not().isIn([NaN]).optional(),
  query('questionNumber').trim().escape().toInt().not().isIn([NaN]).optional()
], (req, res, next) => {
  console.log(`${req.method} request for ${req.url}.`)

  try {
    validationResult(req).throw()
    apiController.getDocument(req, res, next)
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
