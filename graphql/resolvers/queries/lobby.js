require('dotenv').config()
const { ObjectId } = require('mongodb')

const lobby = (app) => {
  return async (root, { _id }) => {
    return app
      .get('db')
      .collection(process.env.DB_COLLECTION_LOBBIES)
      .findOne(ObjectId(_id))
  }
}

module.exports = {
  lobby
}
