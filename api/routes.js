// dependencies
require('dotenv').config()
const API_VERSION = process.env.API_VERSION || 1
const DB_COLLECTION_TRIVIA = process.env.DB_COLLECTION_TRIVIA
const DB_COLLECTION_LOBBIES = process.env.DB_COLLECTION_LOBBIES
const express = require('express')
const router = express.Router()
const { body, param, query, validationResult } = require('express-validator')

// local files
const apiController = require('./controller')

// routes
router.get('/', (req, res) => {
  console.log(`${req.method} request for ${req.url}.`)

  res.send('Welcome to the API')
})

router.get(`/api/v${API_VERSION}/:collection/:triviaId`, [
  param('collection').isString().trim().escape().isIn([DB_COLLECTION_TRIVIA, DB_COLLECTION_LOBBIES]),
  param('triviaId').isString().trim().escape().isLength({ min: 4, max: 4 }),
  query('roundNumber').trim().escape().toInt().not().isIn([NaN]).optional(),
  query('questionNumber').trim().escape().toInt().not().isIn([NaN]).optional(),
  query('tieBreaker').trim().escape().isIn([true]).optional(),
  query('name').isString().trim().escape().matches(/^[a-z0-9]+$/, 'i').isLength({ min: 3, max: 10 }).optional()
], (req, res, next) => {
  console.log(`${req.method} request for ${req.url}.`)

  try {
    validationResult(req).throw()
    apiController.getDocument(req, res, next)
  } catch (validationError) {
    handleValidationError(next, 422, 'API parameter validation failed.', req.method, req.url, validationError.errors)
  }
})

router.post(`/api/v${API_VERSION}/${DB_COLLECTION_TRIVIA}/new`, [
  body('name').isString().trim().escape().matches(/^[a-z0-9]+$/, 'i').isLength({ min: 3, max: 10 })
], (req, res, next) => {
  console.log(`${req.method} request for ${req.url}.`)

  try {
    validationResult(req).throw()
    apiController.insertTriviaAndLobby(req, res, next)
  } catch (validationError) {
    handleValidationError(next, 422, 'API parameter validation failed.', req.method, req.url, validationError.errors)
  }
})

// 404 handler
router.get('*', (req, res) => {
  console.error(`GET request for nonexistent '${req.path}', resulting in a 404.`)

  res.send('404')
})

// handle express-validator validation failure
function handleValidationError (next, statusCode, title, method, location, detail) {
  const error = new Error()
  error.statusCode = statusCode
  error.title = title
  error.method = method
  error.location = location
  error.details = detail
  return next(error)
}

module.exports = router
