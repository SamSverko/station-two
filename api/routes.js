// dependencies
require('dotenv').config()
const API_VERSION = process.env.API_VERSION || 1
const DB_COLLECTION_TRIVIA = process.env.DB_COLLECTION_TRIVIA
const DB_COLLECTION_LOBBIES = process.env.DB_COLLECTION_LOBBIES
const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')

// local files
const apiController = require('./controller')
const utils = require('./utils')

// express-validator parameters
const validateData = {
  action: check('action').isString().isIn(['join', 'leave', 'markResponse']),
  collection: check('collection').isString().isIn([DB_COLLECTION_TRIVIA, DB_COLLECTION_LOBBIES]),
  isHost: check('isHost').trim().escape().isIn([true]),
  name: check('name').isString().trim().escape().matches(/^[a-z0-9]+$/, 'i').isLength({ min: 3, max: 10 }),
  playersOnly: check('playersOnly').trim().escape().isIn([true]),
  questionNumber: check('questionNumber').trim().escape().toInt().isInt({ min: 0, max: 19 }),
  roundNumber: check('roundNumber').trim().escape().toInt().isInt({ min: 0, max: 9 }),
  score: check('score').trim().escape().toInt().isInt({ min: 1, max: 10 }),
  tieBreaker: check('tieBreaker').trim().escape().isIn([true]),
  triviaId: check('triviaId').isString().trim().escape().isLength({ min: 4, max: 4 }),
  uniqueId: check('uniqueId').isString().trim().escape().matches(/^[a-z0-9-]+$/, 'i').isLength({ min: 36, max: 36 })
}

// routes
router.get('/', (req, res) => {
  console.log(`${req.method} request for ${req.url}.`)

  res.send('Welcome to the API')
})

// get document
router.get(`/api/v${API_VERSION}/:collection/:triviaId`, [
  validateData.collection,
  validateData.triviaId,
  validateData.roundNumber.optional(),
  validateData.questionNumber.optional(),
  validateData.tieBreaker.optional(),
  validateData.name.optional(),
  validateData.uniqueId.optional(),
  validateData.playersOnly.optional()
], (req, res, next) => {
  console.log(`${req.method} request for ${req.url}.`)

  try {
    validationResult(req).throw()
    apiController.getDocument(req, res, next)
  } catch (validationError) {
    utils.handleServerError(next, 422, 'API parameter validation failed.', req.method, req.url, validationError.errors)
  }
})

// insert trivia & lobby
router.post(`/api/v${API_VERSION}/${DB_COLLECTION_TRIVIA}/new`, [
  validateData.name
], (req, res, next) => {
  console.log(`${req.method} request for ${req.url}.`)

  try {
    validationResult(req).throw()
    apiController.insertTriviaAndLobby(req, res, next)
  } catch (validationError) {
    utils.handleServerError(next, 422, 'API parameter validation failed.', req.method, req.url, validationError.errors)
  }
})

// update document
router.post(`/api/v${API_VERSION}/:collection/:action`, [
  validateData.collection,
  validateData.action,
  validateData.triviaId,
  validateData.name.optional(),
  validateData.uniqueId.optional(),
  validateData.isHost.optional(),
  validateData.roundNumber.optional(),
  validateData.questionNumber.optional(),
  validateData.score.optional()
], (req, res, next) => {
  console.log(`${req.method} request for ${req.url}.`)

  try {
    validationResult(req).throw()
    if (req.params.action === 'join' && req.params.collection === DB_COLLECTION_LOBBIES && typeof req.body.name !== 'undefined' && typeof req.body.uniqueId !== 'undefined') {
      apiController.joinLobby(req, res, next)
    } else if (req.params.action === 'leave' && req.params.collection === DB_COLLECTION_LOBBIES && typeof req.body.name !== 'undefined' && typeof req.body.uniqueId !== 'undefined') {
      apiController.leaveLobby(req, res, next)
    } else if (req.params.action === 'markResponse') {
      res.send('mark response')
    } else {
      utils.handleServerError(next, 422, 'API parameter validation failed.', req.method, req.url, 'Sufficient data to validate was not provided.')
    }
  } catch (validationError) {
    utils.handleServerError(next, 422, 'API parameter validation failed.', req.method, req.url, validationError.errors)
  }
})

// 404 handler
router.get('*', (req, res) => {
  console.error(`GET request for nonexistent '${req.path}', resulting in a 404.`)

  res.send('404')
})

module.exports = router
