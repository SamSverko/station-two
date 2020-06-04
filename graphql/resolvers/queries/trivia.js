require('dotenv').config()
const { ObjectId } = require('mongodb')

const trivia = (app) => {
  return async (root, { _id }) => {
    
    const response = await app
      .get('db')
      .collection(process.env.DB_COLLECTION_TRIVIA)
      .findOne(ObjectId(_id))
    console.log(response)
    return response
  }
}

module.exports = {
  trivia
}
