// dependencies
require('dotenv').config()
const API_VERSION = process.env.API_VERSION || 1
const DB_COLLECTION_TRIVIA = process.env.DB_COLLECTION_TRIVIA
const DB_COLLECTION_LOBBIES = process.env.DB_COLLECTION_LOBBIES
const express = require('express')
const router = express.Router()
const { body, check, validationResult } = require('express-validator')

// local files
const apiController = require('./controller')
const utils = require('./utils')

// express-validator parameters
const validateData = {
  collection: check('collection', 'Value must be [trivia] or [lobbies]').isString().isIn([DB_COLLECTION_TRIVIA, DB_COLLECTION_LOBBIES]),
  isHost: check('isHost', 'Value must be [true] or [false]').trim().escape().isBoolean().toBoolean(),
  name: body('name', 'Value must be between 3 and 10 alphanumeric characters (inclusive) [a-z0-9]').isString().trim().escape().isLength({ min: 3, max: 10 }),
  nameOptional: body('name', 'Value must be between 3 and 10 alphanumeric characters (inclusive) [a-z0-9]').isString().trim().escape().isLength({ min: 3, max: 10 }).optional(),
  playerResponse: check('playerResponse', 'Value can be any length greater than 1 of all characters').isString().trim().escape(),
  playersOnlyOptional: check('playersOnly', 'Value must be [true]').trim().escape().isIn([true]).optional(),
  questionNumberOptional: check('questionNumber', 'Value must be between [0] and [19] (inclusive)').trim().escape().toInt().isInt({ min: 0, max: 19 }).optional(),
  roundPointValueOptional: check('roundPointValue', 'Value must be between [0.5] and [10.0] (inclusive)').trim().escape().toFloat().isFloat({ min: 0.5, max: 10.0 }).optional(),
  roundNumber: check('roundNumber', 'Value must be between [0] and [9] (inclusive)').trim().escape().toInt().isInt({ min: 0, max: 9 }),
  roundNumberOptional: check('roundNumber', 'Value must be between [0] and [9] (inclusive)').trim().escape().toInt().isInt({ min: 0, max: 9 }).optional(),
  roundQuestions: check('roundQuestions', 'Value must be an array with between [1] and [20] (inclusive) items').isArray().notEmpty().isLength({ min: 1, max: 20 }),
  roundQuestionsOptions: check('roundQuestions.*.options', 'Value must be an array with exactly 4 items').isArray().notEmpty(),
  roundQuestionsOptionsOption: check('roundQuestions.*.options.*', 'Value can be any length greater than 1 of all characters').isString().notEmpty().trim().escape(),
  roundQuestionsQuestion: check('roundQuestions.*.question', 'Value can be any length greater than 1 of all characters').isString().notEmpty().trim().escape(),
  roundThemeOptional: check('roundTheme', 'Value can be any length greater than 1 of all characters').isString().notEmpty().trim().escape().optional(),
  roundType: check('roundType', 'Value must be either [multipleChoice], [lightning], [picture], or [tieBreaker]').isString().isIn(['multipleChoice', 'lightning', 'picture', 'tieBreaker']),
  score: check('score', 'Value must be between [0.0] and [10.0] (inclusive)').trim().escape().toFloat().isFloat({ min: 0, max: 10.0 }),
  tieBreakerOptional: check('tieBreaker', 'Value must be [true]').trim().escape().isIn([true]).optional(),
  triviaId: check('triviaId', 'Value must be 4 alphabetical characters [a-z]').isString().trim().escape().isLength({ min: 4, max: 4 }),
  uniqueId: check('uniqueId', 'Value must be 36 alphabetical characters, including dashes [a-z-]').isString().not().isEmpty().trim().escape().matches(/^[a-z0-9-]+$/, 'i').isLength({ min: 36, max: 36 }),
  uniqueIdOptional: check('uniqueId', 'Value must be 36 alphabetical characters, including dashes [a-z-]').isString().not().isEmpty().trim().escape().matches(/^[a-z0-9-]+$/, 'i').isLength({ min: 36, max: 36 }).optional()
}

// routes
router.get('/', (req, res) => {
  console.log(`${req.method} request for ${req.url}.`)

  res.send('Welcome to the API')
})

// get (filtered) document
router.get(`/api/v${API_VERSION}/getDocument/:collection/:triviaId`, [
  validateData.collection,
  validateData.triviaId,
  validateData.roundNumberOptional,
  validateData.questionNumberOptional,
  validateData.tieBreakerOptional,
  validateData.nameOptional,
  validateData.uniqueIdOptional,
  validateData.playersOnlyOptional
], (req, res, next) => {
  console.log(`${req.method} request for GET (FILTERED) DOCUMENT.`)

  try {
    validationResult(req).throw()
    apiController.getDocument(req, res, next)
  } catch (validationError) {
    utils.handleServerError(next, 422, 'API parameter validation failed.', req.method, req.url, validationError.errors)
  }
})

// join lobby
router.post(`/api/v${API_VERSION}/joinLobby`, [
  validateData.triviaId,
  validateData.name,
  validateData.uniqueId,
  validateData.isHost
], (req, res, next) => {
  console.log(`${req.method} request for JOIN LOBBY.`)
  try {
    validationResult(req).throw()
    apiController.joinLobby(req, res, next)
  } catch (validationError) {
    utils.handleServerError(next, 422, 'API parameter validation failed.', req.method, req.url, validationError.errors)
  }
})

// leave lobby
router.post(`/api/v${API_VERSION}/leaveLobby`, [
  validateData.triviaId,
  validateData.name,
  validateData.uniqueId
], (req, res, next) => {
  console.log(`${req.method} request for LEAVE LOBBY.`)
  try {
    validationResult(req).throw()
    apiController.leaveLobby(req, res, next)
  } catch (validationError) {
    utils.handleServerError(next, 422, 'API parameter validation failed.', req.method, req.url, validationError.errors)
  }
})

// create trivia & lobby
router.post(`/api/v${API_VERSION}/createTrivia`, [
  validateData.name
], (req, res, next) => {
  console.log(`${req.method} request for CREATE TRIVIA & LOBBY.`)

  try {
    validationResult(req).throw()
    apiController.createTriviaAndLobby(req, res, next)
  } catch (validationError) {
    utils.handleServerError(next, 422, 'API parameter validation failed.', req.method, req.url, validationError.errors)
  }
})

// add multiple choice round
router.post(`/api/v${API_VERSION}/addMultipleChoiceRound`, [
  validateData.triviaId,
  validateData.roundThemeOptional,
  validateData.roundPointValueOptional,
  validateData.roundQuestions,
  validateData.roundQuestionsQuestion,
  validateData.roundQuestionsOptions,
  validateData.roundQuestionsOptionsOption
], (req, res, next) => {
  console.log(`${req.method} request for ADD ROUND.`)
  try {
    validationResult(req).throw()

    req.body.roundTheme = (typeof req.body.roundTheme !== 'undefined') ? req.body.roundTheme : 'none'
    req.body.roundPointValue = (typeof req.body.roundPointValue !== 'undefined') ? req.body.roundPointValue : 1

    apiController.addMultipleChoiceRound(req, res, next)
  } catch (validationError) {
    utils.handleServerError(next, 422, 'API parameter validation failed.', req.method, req.url, validationError.errors)
  }
})

// delete round
router.post(`/api/v${API_VERSION}/deleteRound`, [
  validateData.triviaId,
  validateData.roundNumber
], (req, res, next) => {
  console.log(`${req.method} request for DELETE ROUND.`)
  try {
    validationResult(req).throw()
    apiController.deleteRound(req, res, next)
  } catch (validationError) {
    utils.handleServerError(next, 422, 'API parameter validation failed.', req.method, req.url, validationError.errors)
  }
})

// mark response
router.post(`/api/v${API_VERSION}/markResponse`, [
  validateData.triviaId,
  validateData.name,
  validateData.uniqueId,
  validateData.roundType,
  validateData.score,
  validateData.roundNumberOptional,
  validateData.questionNumberOptional
], (req, res, next) => {
  console.log(`${req.method} request for MARK RESPONSE.`)
  try {
    validationResult(req).throw()
    if (req.body.roundType === 'tieBreaker') {
      apiController.markQuestionTieBreaker(req, res, next)
    } else {
      if (typeof req.body.roundNumber !== 'undefined' && typeof req.body.questionNumber !== 'undefined') {
        apiController.markQuestionTieBreaker(req, res, next)
      } else {
        utils.handleServerError(next, 422, 'API parameter validation failed.', req.method, req.url, 'Missing \'roundNumber\' and/or \'questionNumber\' body values.')
      }
    }
  } catch (validationError) {
    utils.handleServerError(next, 422, 'API parameter validation failed.', req.method, req.url, validationError.errors)
  }
})

// submit response
router.post(`/api/v${API_VERSION}/submitResponse`, [
  validateData.triviaId,
  validateData.name,
  validateData.uniqueId,
  validateData.roundType,
  validateData.playerResponse,
  validateData.roundNumberOptional,
  validateData.questionNumberOptional
], (req, res, next) => {
  console.log(`${req.method} request for SUBMIT RESPONSE.`)
  try {
    validationResult(req).throw()
    if (req.body.roundType === 'tieBreaker') {
      if (!isNaN(req.body.playerResponse)) {
        req.body.playerResponse = parseInt(req.body.playerResponse)
        apiController.submitResponse(req, res, next)
      } else {
        utils.handleServerError(next, 422, 'API parameter validation failed.', req.method, req.url, 'Incorrect playerResponse format.')
      }
    } else if (req.body.roundType === 'multipleChoice') {
      const multipleChoiceValues = [0, 1, 2, 3]
      req.body.playerResponse = parseInt(req.body.playerResponse)
      if (multipleChoiceValues.includes(req.body.playerResponse) && typeof req.body.roundNumber !== 'undefined' && typeof req.body.questionNumber !== 'undefined') {
        apiController.submitResponse(req, res, next)
      } else {
        utils.handleServerError(next, 422, 'API parameter validation failed.', req.method, req.url, 'Validation error for \'playerResponse\', \'roundNumber\', and/or \'questionNumber\' body values.')
      }
    } else {
      if (req.body.roundNumber !== 'undefined' && typeof req.body.questionNumber !== 'undefined') {
        apiController.submitResponse(req, res, next)
      } else {
        utils.handleServerError(next, 422, 'API parameter validation failed.', req.method, req.url, 'Validation error for \'roundNumber\' and/or \'questionNumber\' body values.')
      }
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
