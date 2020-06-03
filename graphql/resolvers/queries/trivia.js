require('dotenv').config()
const { ObjectId } = require('mongodb')

const trivia = (app) => {
  return async (root, { _id }) => {
    return app
      .get('db')
      .collection(process.env.DB_COLLECTION_TRIVIA)
      .findOne(ObjectId(_id))
  }
}

module.exports = {
  trivia
}
