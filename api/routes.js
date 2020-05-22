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
  name: body('name', 'Value must be between 3 and 10 alphanumeric characters (inclusive) [a-z0-9]').isString().trim().isLength({ min: 3, max: 10 }),
  nameOptional: body('name', 'Value must be between 3 and 10 alphanumeric characters (inclusive) [a-z0-9]').isString().trim().isLength({ min: 3, max: 10 }).optional(),
  playerResponse: check('playerResponse', 'Value can be any length greater than 1 of all characters').isString().notEmpty().trim(),
  playersOnlyOptional: check('playersOnly', 'Value must be [true]').trim().isIn([true]).optional(),
  questionNumberOptional: check('questionNumber', 'Value must be between [0] and [19] (inclusive)').trim().toInt().isInt({ min: 0, max: 19 }).optional(),
  roundLightningQuestions: check('roundLightningQuestions', 'Value must be an array with between [1] and [20] (inclusive) items').isArray().notEmpty().isLength({ min: 1, max: 20 }),
  roundLightningQuestionsAnswer: check('roundLightningQuestions.*.answer', 'Value can be any length greater than 1 of all characters').isString().notEmpty().trim(),
  roundLightningQuestionsQuestion: check('roundLightningQuestions.*.question', 'Value can be any length greater than 1 of all characters').isString().notEmpty().trim(),
  roundNumber: check('roundNumber', 'Value must be between [0] and [9] (inclusive)').trim().toInt().isInt({ min: 0, max: 9 }),
  roundNumberOptional: check('roundNumber', 'Value must be between [0] and [9] (inclusive)').trim().toInt().isInt({ min: 0, max: 9 }).optional(),
  roundPictures: check('roundPictures', 'Value must be an array with between [1] and [20] (inclusive) items').isArray().notEmpty().isLength({ min: 1, max: 20 }),
  roundPicturesUrl: check('roundPictures.*.url', 'Value must be a valid [URL]').isString().notEmpty().trim(),
  roundPicturesAnswer: check('roundPictures.*.answer', 'Value can be any length greater than 1 of all characters').isString().notEmpty().trim(),
  roundPointValueOptional: check('roundPointValue', 'Value must be between [0.5] and [10.0] (inclusive)').trim().toFloat().isFloat({ min: 0.5, max: 10.0 }).optional(),
  roundQuestions: check('roundQuestions', 'Value must be an array with between [1] and [20] (inclusive) items').isArray().notEmpty().isLength({ min: 1, max: 20 }),
  roundQuestionsAnswer: check('roundQuestions.*.answer', 'Value can be any length greater than 1 of all characters').toInt().isInt({ min: 0, max: 3 }),
  roundQuestionsOptions: check('roundQuestions.*.options', 'Value must be an array with 4 items').isArray().notEmpty(),
  roundQuestionsOptionsOption: check('roundQuestions.*.options.*', 'Value can be any length greater than 1 of all characters').isString().notEmpty().trim(),
  roundQuestionsQuestion: check('roundQuestions.*.question', 'Value can be any length greater than 1 of all characters').isString().notEmpty().trim(),
  roundThemeOptional: check('roundTheme', 'Value can be any length greater than 1 of all characters').isString().notEmpty().trim().optional(),
  roundType: check('roundType', 'Value must be either [multipleChoice], [lightning], [picture], or [tieBreaker]').isString().isIn(['multipleChoice', 'lightning', 'picture', 'tieBreaker']),
  score: check('score', 'Value must be between [0.0] and [10.0] (inclusive)').trim().toFloat().isFloat({ min: 0, max: 10.0 }),
  tieBreakerOptional: check('tieBreaker', 'Value must be [true]').trim().isIn([true]).optional(),
  tieBreakerAnswer: check('tieBreakerAnswer', 'Value must be an integer of any amount').trim().toInt().isInt(),
  tieBreakerQuestion: check('tieBreakerQuestion', 'Value can be any length greater than 1 of all characters').isString().notEmpty().trim(),
  triviaId: check('triviaId', 'Value must be 4 alphabetical characters [a-z]').isString().trim().isLength({ min: 4, max: 4 }),
  uniqueId: check('uniqueId', 'Value must be 36 alphabetical characters, including dashes [a-z-]').isString().not().isEmpty().trim().matches(/^[a-z0-9-]+$/, 'i').isLength({ min: 36, max: 36 }),
  uniqueIdOptional: check('uniqueId', 'Value must be 36 alphabetical characters, including dashes [a-z-]').isString().not().isEmpty().trim().matches(/^[a-z0-9-]+$/, 'i').isLength({ min: 36, max: 36 }).optional()
}

// routes
// router.get('/', (req, res) => {
//   console.log(`${req.method} request for ${req.url}.`)

//   res.send('Welcome to the API')
// })

router.get('/api', (req, res) => {
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
  validateData.uniqueId
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
  validateData.roundQuestionsOptionsOption,
  validateData.roundQuestionsAnswer
], (req, res, next) => {
  console.log(`${req.method} request for ADD MULTIPLE CHOICE ROUND.`)
  try {
    validationResult(req).throw()

    req.body.roundTheme = (typeof req.body.roundTheme !== 'undefined') ? req.body.roundTheme : 'none'
    req.body.roundPointValue = (typeof req.body.roundPointValue !== 'undefined') ? req.body.roundPointValue : 1

    // validate [roundQuestions.*.options] length
    req.body.roundQuestions.forEach((question) => {
      if (question.options.length !== 4) {
        utils.handleServerError(next, 422, 'API parameter validation failed.', req.method, req.url, '[roundQuestions.*.options] must be an array with 4 items')
      }
    })

    apiController.addMultipleChoiceRound(req, res, next)
  } catch (validationError) {
    utils.handleServerError(next, 422, 'API parameter validation failed.', req.method, req.url, validationError.errors)
  }
})

// update multiple choice round
router.post(`/api/v${API_VERSION}/updateMultipleChoiceRound`, [
  validateData.triviaId,
  validateData.roundNumber,
  validateData.roundThemeOptional,
  validateData.roundPointValueOptional,
  validateData.roundQuestions,
  validateData.roundQuestionsQuestion,
  validateData.roundQuestionsOptions,
  validateData.roundQuestionsOptionsOption,
  validateData.roundQuestionsAnswer
], (req, res, next) => {
  console.log(`${req.method} request for UPDATE MULTIPLE CHOICE ROUND.`)
  try {
    validationResult(req).throw()

    req.body.roundTheme = (typeof req.body.roundTheme !== 'undefined') ? req.body.roundTheme : 'none'
    req.body.roundPointValue = (typeof req.body.roundPointValue !== 'undefined') ? req.body.roundPointValue : 1

    // validate [roundQuestions.*.options] length
    req.body.roundQuestions.forEach((question) => {
      if (question.options.length !== 4) {
        utils.handleServerError(next, 422, 'API parameter validation failed.', req.method, req.url, '[roundQuestions.*.options] must be an array with 4 items')
      }
    })

    apiController.updateMultipleChoiceRound(req, res, next)
  } catch (validationError) {
    utils.handleServerError(next, 422, 'API parameter validation failed.', req.method, req.url, validationError.errors)
  }
})

// add lightning round
router.post(`/api/v${API_VERSION}/addLightningRound`, [
  validateData.triviaId,
  validateData.roundThemeOptional,
  validateData.roundPointValueOptional,
  validateData.roundLightningQuestions,
  validateData.roundLightningQuestionsQuestion,
  validateData.roundLightningQuestionsAnswer
], (req, res, next) => {
  console.log(`${req.method} request for ADD LIGHTNING ROUND.`)
  try {
    validationResult(req).throw()

    req.body.roundTheme = (typeof req.body.roundTheme !== 'undefined') ? req.body.roundTheme : 'none'
    req.body.roundPointValue = (typeof req.body.roundPointValue !== 'undefined') ? req.body.roundPointValue : 1

    apiController.addLightningRound(req, res, next)
  } catch (validationError) {
    utils.handleServerError(next, 422, 'API parameter validation failed.', req.method, req.url, validationError.errors)
  }
})

// add lightning round
router.post(`/api/v${API_VERSION}/updateLightningRound`, [
  validateData.triviaId,
  validateData.roundNumber,
  validateData.roundThemeOptional,
  validateData.roundPointValueOptional,
  validateData.roundLightningQuestions,
  validateData.roundLightningQuestionsQuestion,
  validateData.roundLightningQuestionsAnswer
], (req, res, next) => {
  console.log(`${req.method} request for UPDATE LIGHTNING ROUND.`)
  try {
    validationResult(req).throw()

    req.body.roundTheme = (typeof req.body.roundTheme !== 'undefined') ? req.body.roundTheme : 'none'
    req.body.roundPointValue = (typeof req.body.roundPointValue !== 'undefined') ? req.body.roundPointValue : 1

    apiController.updateLightningRound(req, res, next)
  } catch (validationError) {
    utils.handleServerError(next, 422, 'API parameter validation failed.', req.method, req.url, validationError.errors)
  }
})

// add picture round
router.post(`/api/v${API_VERSION}/addPictureRound`, [
  validateData.triviaId,
  validateData.roundThemeOptional,
  validateData.roundPointValueOptional,
  validateData.roundPictures,
  validateData.roundPicturesUrl,
  validateData.roundPicturesAnswer
], (req, res, next) => {
  console.log(`${req.method} request for ADD PICTURE ROUND.`)
  try {
    validationResult(req).throw()

    req.body.roundTheme = (typeof req.body.roundTheme !== 'undefined') ? req.body.roundTheme : 'none'
    req.body.roundPointValue = (typeof req.body.roundPointValue !== 'undefined') ? req.body.roundPointValue : 1

    apiController.addPictureRound(req, res, next)
  } catch (validationError) {
    utils.handleServerError(next, 422, 'API parameter validation failed.', req.method, req.url, validationError.errors)
  }
})

// update picture round
router.post(`/api/v${API_VERSION}/updatePictureRound`, [
  validateData.triviaId,
  validateData.roundNumber,
  validateData.roundThemeOptional,
  validateData.roundPointValueOptional,
  validateData.roundPictures,
  validateData.roundPicturesUrl,
  validateData.roundPicturesAnswer
], (req, res, next) => {
  console.log(`${req.method} request for UPDATE PICTURE ROUND.`)
  try {
    validationResult(req).throw()

    req.body.roundTheme = (typeof req.body.roundTheme !== 'undefined') ? req.body.roundTheme : 'none'
    req.body.roundPointValue = (typeof req.body.roundPointValue !== 'undefined') ? req.body.roundPointValue : 1

    apiController.updatePictureRound(req, res, next)
  } catch (validationError) {
    utils.handleServerError(next, 422, 'API parameter validation failed.', req.method, req.url, validationError.errors)
  }
})

// update tie breaker
router.post(`/api/v${API_VERSION}/updateTieBreaker`, [
  validateData.triviaId,
  validateData.tieBreakerQuestion,
  validateData.tieBreakerAnswer
], (req, res, next) => {
  console.log(`${req.method} request for TIE BREAKER.`)
  try {
    validationResult(req).throw()

    apiController.updateTieBreaker(req, res, next)
  } catch (validationError) {
    utils.handleServerError(next, 422, 'API parameter validation failed.', req.method, req.url, validationError.errors)
  }
})

// delete round
router.delete(`/api/v${API_VERSION}/deleteRound`, [
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

  res.send('[API] 404')
})

module.exports = router
