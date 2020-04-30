// dependencies
require('dotenv').config()
const DB_COLLECTION_TRIVIA = process.env.DB_COLLECTION_TRIVIA
const DB_COLLECTION_LOBBIES = process.env.DB_COLLECTION_LOBBIES
const fetch = require('fetch').fetchUrl

// local files
const utils = require('./utils')

module.exports = {
  joinLobby: async (req, res, next) => {
    fetch(`http://localhost:4000/api/v1/${DB_COLLECTION_LOBBIES}/${req.body.triviaId}?playersOnly=true`, (error, meta, body) => {
      if (error) {
        utils.handleServerError(next, 502, 'Database query failed.', req.method, req.url, `'joinLobby() fetch' query failed for triviaId: ${req.body.triviaId} .`)
      }
      const lobby = JSON.parse(body)
      if (req.body.isHost || lobby.length > 0) {
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
      } else {
        utils.handleServerError(next, 401, 'Lobby is not available to join.', req.method, req.url, 'The host has not yet entered the lobby, meaning you cannot.')
      }
    })
  },
  insertTriviaAndLobby: async (req, res, next) => {
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
          utils.handleServerError(next, 502, 'Database query failed.', req.method, req.url, '\'insertTriviaAndLobby() find\' query failed.')
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
                utils.handleServerError(next, 502, 'Database query failed.', req.method, req.url, `'insertTriviaAndLobby() insertOne trivia' query failed for triviaId: ${newTriviaId} .`)
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
                      utils.handleServerError(next, 502, 'Database query failed.', req.method, req.url, `'insertTriviaAndLobby() insertOne lobby' query failed for triviaId: ${newTriviaId} .`)
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
          } else if (req.params.collection === DB_COLLECTION_LOBBIES) {
            // tieBreaker responses || specified responses from specified round || all responses from specified round || specified responses from all rounds
            if (typeof req.query.playersOnly !== 'undefined') {
              document = result.players
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
    if (req.params.action === 'markQuestion') {
      filter.responses.$elemMatch.roundNumber = req.body.roundNumber
      filter.responses.$elemMatch.questionNumber = req.body.questionNumber
    } else if (req.params.action === 'markTieBreaker') {
      filter.responses.$elemMatch.roundType = 'tieBreaker'
    }
    req.app.db.collection(req.params.collection).updateOne(
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
  removeRound: async (req, res, next) => {
    req.app.db.collection(DB_COLLECTION_TRIVIA).updateOne(
      { triviaId: req.body.triviaId },
      {
        $unset: {
          [`rounds.${req.body.roundNumber}`]: 1
        }
      },
      (error, result) => {
        if (error) {
          utils.handleServerError(next, 502, 'Database query failed.', req.method, req.url, '\'removeRound() updateOne $unset\' query failed.')
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
                utils.handleServerError(next, 502, 'Database query failed.', req.method, req.url, '\'removeRound() updateOne $pull\' query failed.')
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
          responseToAdd.response = (req.body.roundType === 'tieBreaker' || req.body.roundType === 'multipleChoice') ? parseInt(req.body.playerResponse) : req.body.playerResponse
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
