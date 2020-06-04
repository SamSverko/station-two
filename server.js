// node
const bodyParser = require('body-parser')

// dependencies
require('dotenv').config()
const express = require('express')
const app = express()
const helmet = require('helmet')
const cors = require('cors')
const compression = require('compression')
const { MongoClient, ObjectId } = require('mongodb')
const mongoSanitize = require('express-mongo-sanitize')
const { ApolloServer, gql } = require('apollo-server')

// helmet, cors, gzip compression, urlencoded (for form submits), bodyParser for JSON posts, and mongoSanitize
app.use(helmet())
app.use(cors())
app.use(compression())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(mongoSanitize())

// database connection
MongoClient.connect(process.env.DB_URL, {
  poolSize: 25,
  useUnifiedTopology: true,
  wtimeout: 2500
})
  .catch(error => {
    console.log(error.stack)
    process.exit(1)
  })
  .then(async client => {
    console.log(`Connected to database: ${process.env.DB_NAME}`)

    app.set('db', client.db(process.env.DB_NAME))
    const triviaCollection = app.get('db').collection(process.env.DB_COLLECTION_TRIVIA)

    const typeDefs = gql`
      # ROOT TYPES ==================================================
      type Query {
        trivia(_id: String!): Trivia
      }

      # INTERFACES ==================================================
      interface Round {
        type: String!
        theme: String!
        pointValue: Int!
      }

      type LightningRound implements Round {
        type: String!
        theme: String!
        pointValue: Int!
        questions: [LightningRoundQuestion]
      }

      type MultipleChoiceRound implements Round {
        type: String!
        theme: String!
        pointValue: Int!
        questions: [MultipleChoiceRoundQuestion]
      }

      type PictureRound implements Round {
        type: String!
        theme: String!
        pointValue: Int!
        pictures: [PictureRoundPicture]
      }

      # QUERY TYPES =================================================
      type LightningRoundQuestion {
        question: String!
        answer: String!
      }

      type MultipleChoiceRoundQuestion {
        question: String!
        options: [String!]!
        answer: Int!
      }

      type PictureRoundPicture {
        url: String!
        answer: String!
      }

      type Trivia {
        _id: String!
        createdAt: String!
        triviaId: String!
        triviaPin: String!
        host: String!
        rounds: [Round]!
        tieBreaker: TieBreaker!
      }

      type TieBreaker {
        question: String
        answer: Int
      }
    `

    const resolvers = {
      Query: {
        trivia: async (root, { _id }) => {
          return triviaCollection.findOne(ObjectId(_id))
        }
      }
    }

    const server = new ApolloServer({ typeDefs, resolvers })

    server.listen().then(({ url }) => {
      console.log(`🚀 Server ready at ${url}`)
    })
  })

// server error handler
app.use((error, req, res, next) => {
  if (!error.statusCode) error.statusCode = 500
  // console.error(error)
  res.send(error)
})

// app graceful stop
process.on('SIGINT', function () {
  console.log('SIGINT')
  process.exit(0)
})
