// dependencies
require('dotenv').config()

module.exports = {
  getDocument: async (req, res, next) => {
    req.app.db.collection(req.params.collection).findOne(
      { triviaId: req.params.triviaId },
      { projection: { _id: 0, createdAt: 0 } },
      (error, result) => {
        if (error) {
          res.send(error)
        } else if (!result) {
          const error = new Error()
          error.statusCode = 404
          error.title = 'Document not found.'
          error.method = req.method
          error.location = req.url
          error.details = `No document was found using code ${req.params.triviaId}`
          next(error)
        } else {
          let document = result
          if (req.params.collection === process.env.DB_COLLECTION_TRIVIA) {
          } else if (req.params.collection === process.env.DB_COLLECTION_LOBBIES) {
            // tieBreaker responses || specified responses from specified round || all responses from specified round || specified responses from all rounds
            if (typeof req.query.tieBreaker !== 'undefined') {
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
            if (typeof req.query.name !== 'undefined') {
              const arrayToSearch = (typeof req.query.roundNumber !== 'undefined' || typeof req.query.questionNumber !== 'undefined') ? document : document.responses
              const filteredReponses = []
              arrayToSearch.forEach((response) => {
                if (response.name === req.query.name) {
                  filteredReponses.push(response)
                }
              })
              document = filteredReponses
            }
          }
          res.send(document)
        }
      })
  }
}
