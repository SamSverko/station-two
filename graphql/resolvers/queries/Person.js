require('dotenv').config()
const { ObjectId } = require('mongodb')

const person = (app) => {
  return async (root, { _id }) => {
    return app
      .get('db')
      .collection(process.env.DB_COLLECTION_GRAPHQL)
      .findOne(ObjectId(_id))
  }
}

module.exports = {
  person
}
