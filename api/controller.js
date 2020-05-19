// dependencies
require('dotenv').config()
const DB_COLLECTION_TRIVIA = process.env.DB_COLLECTION_TRIVIA
const DB_COLLECTION_LOBBIES = process.env.DB_COLLECTION_LOBBIES
const fetch = require('fetch').fetchUrl

// local files
const utils = require('./utils')

module.exports = {
  addMultipleChoiceRound: async (req, res, next) => {
    const roundToInsert = {
      type: 'multipleChoice',
      theme: req.body.roundTheme,
      pointValue: req.body.roundPointValue,
      questions: req.body.roundQuestions
    }
    req.app.db.collection(DB_COLLECTION_TRIVIA).updateOne(
      { triviaId: req.body.triviaId },
      {
        $push: {
          rounds: roundToInsert
        }
      },
      (error, result) => {
        if (error) {
          utils.handleServerError(next, 502, 'Database query failed.', req.method, req.url, '\'addMultipleChoiceRound() updateOne\' query failed.')
        } else {
          res.sendStatus(200)
        }
      }
    )
  },
  updateMultipleChoiceRound: async (req, res, next) => {
    const roundToInsert = {
      type: 'multipleChoice',
      theme: req.body.roundTheme,
      pointValue: req.body.roundPointValue,
      questions: req.body.roundQuestions
    }

    req.app.db.collection(DB_COLLECTION_TRIVIA).updateOne(
      { triviaId: req.body.triviaId },
      {
        $set: {
          [`rounds.${req.body.roundNumber}`]: roundToInsert
        }
      },
      (error, result) => {
        if (error) {
          utils.handleServerError(next, 502, 'Database query failed.', req.method, req.url, '\'addMultipleChoiceRound() updateOne\' query failed.')
        } else {
          res.sendStatus(200)
        }
      }
    )
  },
  addLightningRound: async (req, res, next) => {
    const roundToInsert = {
      type: 'lightning',
      theme: req.body.roundTheme,
      pointValue: req.body.roundPointValue,
      questions: req.body.roundLightningQuestions
    }
    req.app.db.collection(DB_COLLECTION_TRIVIA).updateOne(
      { triviaId: req.body.triviaId },
      {
        $push: {
          rounds: roundToInsert
        }
      },
      (error, result) => {
        if (error) {
          utils.handleServerError(next, 502, 'Database query failed.', req.method, req.url, '\'addLightningRound() updateOne\' query failed.')
        } else {
          res.sendStatus(200)
        }
      }
    )
  },
  updateLightningRound: async (req, res, next) => {
    const roundToInsert = {
      type: 'lightning',
      theme: req.body.roundTheme,
      pointValue: req.body.roundPointValue,
      questions: req.body.roundLightningQuestions
    }

    req.app.db.collection(DB_COLLECTION_TRIVIA).updateOne(
      { triviaId: req.body.triviaId },
      {
        $set: {
          [`rounds.${req.body.roundNumber}`]: roundToInsert
        }
      },
      (error, result) => {
        if (error) {
          utils.handleServerError(next, 502, 'Database query failed.', req.method, req.url, '\'addMultipleChoiceRound() updateOne\' query failed.')
        } else {
          res.sendStatus(200)
        }
      }
    )
  },
  addPictureRound: async (req, res, next) => {
    const roundToInsert = {
      type: 'picture',
      theme: req.body.roundTheme,
      pointValue: req.body.roundPointValue,
      pictures: req.body.roundPictures
    }
    req.app.db.collection(DB_COLLECTION_TRIVIA).updateOne(
      { triviaId: req.body.triviaId },
      {
        $push: {
          rounds: roundToInsert
        }
      },
      (error, result) => {
        if (error) {
          utils.handleServerError(next, 502, 'Database query failed.', req.method, req.url, '\'addPictureRound() updateOne\' query failed.')
        } else {
          res.sendStatus(200)
        }
      }
    )
  },
  updatePictureRound: async (req, res, next) => {
    const roundToInsert = {
      type: 'picture',
      theme: req.body.roundTheme,
      pointValue: req.body.roundPointValue,
      pictures: req.body.roundPictures
    }

    req.app.db.collection(DB_COLLECTION_TRIVIA).updateOne(
      { triviaId: req.body.triviaId },
      {
        $set: {
          [`rounds.${req.body.roundNumber}`]: roundToInsert
        }
      },
      (error, result) => {
        if (error) {
          utils.handleServerError(next, 502, 'Database query failed.', req.method, req.url, '\'addMultipleChoiceRound() updateOne\' query failed.')
        } else {
          res.sendStatus(200)
        }
      }
    )
  },
  updateTieBreaker: async (req, res, next) => {
    const tieBreakerToInsert = {
      question: req.body.tieBreakerQuestion,
      answer: req.body.tieBreakerAnswer
    }
    req.app.db.collection(DB_COLLECTION_TRIVIA).updateOne(
      { triviaId: req.body.triviaId },
      {
        $set: {
          tieBreaker: tieBreakerToInsert
        }
      },
      (error, result) => {
        if (error) {
          utils.handleServerError(next, 502, 'Database query failed.', req.method, req.url, '\'updateTieBreaker() updateOne\' query failed.')
        } else {
          res.sendStatus(200)
        }
      }
    )
  },
  createTriviaAndLobby: async (req, res, next) => {
    // retrieve all existing triviaIds
    req.app.db.collection(DB_COLLECTION_TRIVIA).find(
      {},
      {
        projection: {
          _id: 0,
          createdAt: 0,
          host: 0,
          rounds: 0,
          tieBreaker: 0
        }
      })
      .toArray((error, documents) => {
        if (error) {
          utils.handleServerError(next, 502, 'Database query failed.', req.method, req.url, '\'createTriviaAndLobby() find\' query failed.')
        } else {
          const existingTriviaIds = []
          documents.forEach((document) => {
            existingTriviaIds.push(document.triviaId)
          })
          // generate a triviaId that does not match any already-existing triviaIds
          let newTriviaId = ''
          const availableCharacters = 'abcdefghijklmnopqrstuvwxyz'
          do {
            // newTriviaId = ''
            for (let i = 0; i < 4; i++) {
              newTriviaId += availableCharacters.charAt(Math.floor(Math.random() * availableCharacters.length))
            }
          } while (existingTriviaIds.includes(newTriviaId))
          // insert new trivia document
          req.app.db.collection(DB_COLLECTION_TRIVIA).insertOne(
            {
              createdAt: new Date().toISOString(),
              triviaId: newTriviaId.toLowerCase(),
              host: req.body.name.toLowerCase(),
              rounds: [],
              tieBreaker: {}
            },
            (error, triviaResult) => {
              if (error) {
                utils.handleServerError(next, 502, 'Database query failed.', req.method, req.url, `'createTriviaAndLobby() insertOne trivia' query failed for triviaId: ${newTriviaId} .`)
              } else {
                // insert associated lobby document
                req.app.db.collection(DB_COLLECTION_LOBBIES).insertOne(
                  {
                    createdAt: new Date().toISOString(),
                    triviaId: newTriviaId.toLowerCase(),
                    host: req.body.name.toLowerCase(),
                    players: [],
                    responses: []
                  },
                  (error, lobbiesResult) => {
                    if (error) {
                      utils.handleServerError(next, 502, 'Database query failed.', req.method, req.url, `'createTriviaAndLobby() insertOne lobby' query failed for triviaId: ${newTriviaId} .`)
                    } else {
                      // return created trivia and lobby documents
                      res.send([triviaResult.ops[0], lobbiesResult.ops[0]])
                    }
                  }
                )
              }
            }
          )
        }
      })
  },
  joinLobby: async (req, res, next) => {
    fetch(`http://localhost:4000/api/v1/getDocument/${DB_COLLECTION_LOBBIES}/${req.body.triviaId}?playersOnly=true`, (error, meta, body) => {
      if (error) {
        utils.handleServerError(next, 502, 'Database query failed.', req.method, req.url, `'joinLobby() fetch' query failed for triviaId: ${req.body.triviaId} .`)
      }
      req.app.db.collection(DB_COLLECTION_LOBBIES).updateOne(
        { triviaId: req.body.triviaId.toLowerCase() },
        {
          $addToSet: {
            players: {
              name: req.body.name.toLowerCase(),
              uniqueId: req.body.uniqueId.toLowerCase()
            }
          }
        },
        (error, result) => {
          if (error) {
            utils.handleServerError(next, 502, 'Database query failed.', req.method, req.url, '\'joinLobby() updateOne\' query failed.')
          } else {
            res.sendStatus(200)
          }
        }
      )
    })
  },
  getDocument: async (req, res, next) => {
    // we must return entire document from db here, then filter on the server because aggregate methods aren't available in MongoDB Atlas free tier
    req.app.db.collection(req.params.collection).findOne(
      { triviaId: req.params.triviaId.toLowerCase() },
      { projection: { _id: 0, createdAt: 0 } },
      (error, result) => {
        if (error) {
          utils.handleServerError(next, 502, 'Database query failed.', req.method, req.url, `'getDocument() findOne' query failed for triviaId: ${req.params.triviaId} .`)
        } else if (!result) {
          utils.handleServerError(next, 404, 'Document not found.', req.method, req.url, `No document was found using code: ${req.params.triviaId}`)
        } else {
          let document = result
          if (req.params.collection === DB_COLLECTION_TRIVIA) {
            if (typeof req.query.roundNumber !== 'undefined' && typeof req.query.questionNumber !== 'undefined') {
              if (document.rounds[req.query.roundNumber].type === 'picture') {
                document = document.rounds[req.query.roundNumber].pictures[req.query.questionNumber]
              } else {
                document = document.rounds[req.query.roundNumber].questions[req.query.questionNumber]
              }
              delete document.answer
            } else if (typeof req.query.roundNumber !== 'undefined') {
              document = document.rounds[req.query.roundNumber]
            }
          } else if (req.params.collection === DB_COLLECTION_LOBBIES) {
            // tieBreaker responses || specified responses from specified round || all responses from specified round || specified responses from all rounds
            if (typeof req.query.playersOnly !== 'undefined') {
              document = {}
              document.host = result.host
              document.players = result.players
            } else if (typeof req.query.tieBreaker !== 'undefined') {
              const filteredReponses = []
              document.responses.forEach((response) => {
                if (response.roundType === 'tieBreaker') {
                  filteredReponses.push(response)
                }
              })
              document = filteredReponses
            } else if (typeof req.query.roundNumber !== 'undefined' && typeof req.query.questionNumber !== 'undefined') {
              const filteredReponses = []
              document.responses.forEach((response) => {
                if (response.roundNumber === req.query.roundNumber && response.questionNumber === req.query.questionNumber) {
                  filteredReponses.push(response)
                }
              })
              document = filteredReponses
            } else if (typeof req.query.roundNumber !== 'undefined') {
              const filteredReponses = []
              document.responses.forEach((response) => {
                if (response.roundNumber === req.query.roundNumber) {
                  filteredReponses.push(response)
                }
              })
              document = filteredReponses
            } else if (typeof req.query.questionNumber !== 'undefined') {
              const filteredReponses = []
              document.responses.forEach((response) => {
                if (response.questionNumber === req.query.questionNumber) {
                  filteredReponses.push(response)
                }
              })
              document = filteredReponses
            }
            // responses only for that player
            if (typeof req.query.name !== 'undefined' && typeof req.query.uniqueId !== 'undefined') {
              const arrayToSearch = (typeof req.query.roundNumber !== 'undefined' || typeof req.query.questionNumber !== 'undefined') ? document : document.responses
              const filteredReponses = []
              arrayToSearch.forEach((response) => {
                if (response.name === req.query.name && response.uniqueId === req.query.uniqueId) {
                  filteredReponses.push(response)
                }
              })
              document = filteredReponses
            }
          }
          res.send(document)
        }
      })
  },
  markQuestionTieBreaker: async (req, res, next) => {
    const filter = {
      triviaId: req.body.triviaId.toLowerCase(),
      responses: {
        $elemMatch: {
          name: req.body.name.toLowerCase(),
          uniqueId: req.body.uniqueId.toLowerCase()
        }
      }
    }
    if (req.body.roundType === 'tieBreaker') {
      filter.responses.$elemMatch.roundType = 'tieBreaker'
    } else {
      filter.responses.$elemMatch.roundNumber = req.body.roundNumber
      filter.responses.$elemMatch.questionNumber = req.body.questionNumber
    }
    req.app.db.collection(DB_COLLECTION_LOBBIES).updateOne(
      filter,
      {
        $set: { 'responses.$.score': req.body.score }
      },
      (error, result) => {
        if (error) {
          utils.handleServerError(next, 502, 'Database query failed.', req.method, req.url, '\'markQuestion() updateOne\' query failed.')
        } else {
          res.sendStatus(200)
        }
      }
    )
  },
  leaveLobby: async (req, res, next) => {
    req.app.db.collection(DB_COLLECTION_LOBBIES).updateOne(
      { triviaId: req.body.triviaId.toLowerCase() },
      {
        $pull: {
          players: {
            name: req.body.name.toLowerCase(),
            uniqueId: req.body.uniqueId.toLowerCase()
          }
        }
      },
      (error, result) => {
        if (error) {
          utils.handleServerError(next, 502, 'Database query failed.', req.method, req.url, '\'leaveLobby() updateOne\' query failed.')
        } else {
          res.sendStatus(200)
        }
      }
    )
  },
  deleteRound: async (req, res, next) => {
    req.app.db.collection(DB_COLLECTION_TRIVIA).updateOne(
      { triviaId: req.body.triviaId },
      {
        $unset: {
          [`rounds.${req.body.roundNumber}`]: 1
        }
      },
      (error, result) => {
        if (error) {
          utils.handleServerError(next, 502, 'Database query failed.', req.method, req.url, '\'deleteRound() updateOne $unset\' query failed.')
        } else {
          req.app.db.collection(DB_COLLECTION_TRIVIA).updateOne(
            { triviaId: req.body.triviaId },
            {
              $pull: {
                rounds: null
              }
            },
            (error, result) => {
              if (error) {
                utils.handleServerError(next, 502, 'Database query failed.', req.method, req.url, '\'deleteRound() updateOne $pull\' query failed.')
              } else {
                res.sendStatus(200)
              }
            }
          )
        }
      }
    )
  },
  submitResponse: async (req, res, next) => {
    // we must use two db queries (delete existing response if exists, then insert response) because aggregate methods aren't available in MongoDB Atlas free tier
    const responseToPull = {
      name: req.body.name.toLowerCase(),
      uniqueId: req.body.uniqueId.toLowerCase()
    }
    if (req.body.roundType === 'tieBreaker') {
      responseToPull.roundType = 'tieBreaker'
    } else {
      responseToPull.roundNumber = req.body.roundNumber
      responseToPull.questionNumber = req.body.questionNumber
    }
    // delete existing response if exists
    req.app.db.collection(DB_COLLECTION_LOBBIES).updateOne(
      { triviaId: req.body.triviaId },
      {
        $pull: { responses: responseToPull }
      },
      (error, result) => {
        if (error) {
          utils.handleServerError(next, 502, 'Database query failed.', req.method, req.url, '\'submitResponse() updateOne $pull\' query failed.')
        } else {
          const responseToAdd = responseToPull
          responseToAdd.response = req.body.playerResponse
          // insert response
          req.app.db.collection(DB_COLLECTION_LOBBIES).updateOne(
            { triviaId: req.body.triviaId },
            { $addToSet: { responses: responseToAdd } },
            (error, result) => {
              if (error) {
                utils.handleServerError(next, 502, 'Database query failed.', req.method, req.url, '\'submitResponse() updateOne $addToSe\' query failed.')
              } else {
                res.sendStatus(200)
              }
            }
          )
        }
      }
    )
  }
}
