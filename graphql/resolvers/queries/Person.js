require('dotenv').config()
const express = require('express')
const app = express()
const { ObjectId } = require('mongodb')

const person = async (root, { _id }) => {
  console.log('Query | person')
  return app.get('db').collection('graphql').findOne(ObjectId(_id))
}

module.exports = {
  person
}
