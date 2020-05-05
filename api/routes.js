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
  action: check('action').isString().isIn(['joinLobby', 'leaveLobby', 'markQuestion', 'markTieBreaker', 'submitResponse', 'removeRound', 'addRound']),
  collection: check('collection').isString().isIn([DB_COLLECTION_TRIVIA, DB_COLLECTION_LOBBIES]),
  isHost: check('isHost').trim().escape().isBoolean().toBoolean(),
  name: body('name').isString().trim().escape().isLength({ min: 3, max: 10 }),
  nameOptional: body('name').isString().trim().escape().isLength({ min: 3, max: 10 }).optional(),
  playerResponse: check('playerResponse').isString().trim().escape(),
  playersOnlyOptional: check('playersOnly').trim().escape().isIn([true]).optional(),
  questionNumberOptional: check('questionNumber').trim().escape().toInt().isInt({ min: 0, max: 19 }).optional(),
  roundPointValue: check('roundPointValue').trim().escape().toFloat().isFloat({ min: 0.5, max: 10.0 }),
  roundNumberOptional: check('roundNumber').trim().escape().toInt().isInt({ min: 0, max: 9 }).optional(),
  roundQuestions: check('roundQuestions').isArray().notEmpty(),
  roundQuestionsQuestion: check('roundQuestions.*.question').isString().notEmpty().trim().escape(),
  roundTheme: check('roundTheme').isString().trim().escape(),
  roundType: check('roundType').isString().isIn(['multipleChoice', 'lightning', 'picture', 'tieBreaker']),
  score: check('score').trim().escape().toFloat().isFloat({ min: 0, max: 10.0 }),
  tieBreakerOptional: check('tieBreaker').trim().escape().isIn([true]).optional(),
  triviaId: check('triviaId').isString().trim().escape().isLength({ min: 4, max: 4 }),
  uniqueId: check('uniqueId').isString().not().isEmpty().trim().escape().matches(/^[a-z0-9-]+$/, 'i').isLength({ min: 36, max: 36 }),
  uniqueIdOptional: check('uniqueId').isString().not().isEmpty().trim().escape().matches(/^[a-z0-9-]+$/, 'i').isLength({ min: 36, max: 36 }).optional()
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

// mark question
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

// router.post(`/api/v${API_VERSION}/:collection/:action`, [
//   validateData.collection,
//   validateData.action,
//   validateData.triviaId,
//   validateData.name.optional(),
//   validateData.uniqueId.optional(),
//   validateData.isHost.optional(),
//   validateData.roundNumber.optional(),
//   validateData.questionNumber.optional(),
//   validateData.tieBreaker.optional(),
//   validateData.score.optional(),
//   validateData.roundType.optional(),
//   validateData.playerResponse.optional(),
//   validateData.roundTheme.optional(),
//   validateData.roundPointValue.optional(),
//   validateData.roundQuestions.optional(),
//   validateData.roundQuestionsQuestion.optional()
// ], (req, res, next) => {
//   console.log(`${req.method} request for ${req.url}.`)

//   try {
//     validationResult(req).throw()
//     if (
//       req.params.action === 'joinLobby' &&
//       req.params.collection === DB_COLLECTION_LOBBIES &&
//       typeof req.body.name !== 'undefined' &&
//       typeof req.body.uniqueId !== 'undefined'
//     ) {
//       apiController.joinLobby(req, res, next) // ===================== DONE =====================
//     } else if (
//       req.params.action === 'leaveLobby' &&
//       req.params.collection === DB_COLLECTION_LOBBIES &&
//       typeof req.body.name !== 'undefined' &&
//       typeof req.body.uniqueId !== 'undefined'
//     ) {
//       apiController.leaveLobby(req, res, next) // ===================== DONE =====================
//     } else if (
//       req.params.action === 'markQuestion' &&
//       req.params.collection === DB_COLLECTION_LOBBIES &&
//       (typeof req.body.name !== 'undefined' && typeof req.body.uniqueId !== 'undefined') &&
//       (typeof req.body.roundNumber !== 'undefined' && typeof req.body.questionNumber !== 'undefined') &&
//       typeof req.body.score !== 'undefined'
//     ) {
//       apiController.markQuestionTieBreaker(req, res, next) // ===================== DONE =====================
//     } else if (
//       req.params.action === 'markTieBreaker' &&
//       req.params.collection === DB_COLLECTION_LOBBIES &&
//       (typeof req.body.name !== 'undefined' && typeof req.body.uniqueId !== 'undefined') &&
//       typeof req.body.score !== 'undefined'
//     ) {
//       apiController.markQuestionTieBreaker(req, res, next) // ===================== DONE =====================
//     } else if (
//       req.params.action === 'submitResponse' &&
//       req.params.collection === DB_COLLECTION_LOBBIES &&
//       (typeof req.body.name !== 'undefined' && typeof req.body.uniqueId !== 'undefined') &&
//       (typeof req.body.roundNumber !== 'undefined' && typeof req.body.questionNumber !== 'undefined') &&
//       (((req.body.roundType === 'multipleChoice' || req.body.roundType === 'tieBreaker') && !isNaN(req.body.playerResponse)) || (req.body.roundType !== 'multipleChoice' && req.body.roundType !== 'tieBreaker'))
//     ) {
//       apiController.submitResponse(req, res, next) // ===================== DONE =====================
//     } else if (
//       req.params.action === 'removeRound' &&
//       req.params.collection === DB_COLLECTION_TRIVIA &&
//       (!isNaN(req.body.roundNumber))
//     ) {
//       apiController.removeRound(req, res, next)
//     } else if (
//       req.params.action === 'addRound' &&
//       typeof req.body.roundType !== 'undefined' &&
//       typeof req.body.roundTheme !== 'undefined' &&
//       (typeof req.body.roundQuestions !== 'undefined' || typeof req.body.roundPictures !== 'undefined')
//     ) {
//       apiController.addRound(req, res, next)
//     } else {
//       utils.handleServerError(next, 422, 'API parameter validation failed.', req.method, req.url, 'Sufficient data to validate was not provided.')
//     }
//   } catch (validationError) {
//     utils.handleServerError(next, 422, 'API parameter validation failed.', req.method, req.url, validationError.errors)
//   }
// })

// 404 handler
router.get('*', (req, res) => {
  console.error(`GET request for nonexistent '${req.path}', resulting in a 404.`)

  res.send('404')
})

module.exports = router
