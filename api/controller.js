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
          res.send(result)
        }
      })
  }
}
