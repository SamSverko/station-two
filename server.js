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
    const lobbyCollection = app.get('db').collection(process.env.DB_COLLECTION_LOBBIES)
    const triviaCollection = app.get('db').collection(process.env.DB_COLLECTION_TRIVIA)

    const typeDefs = gql`
      # ROOT TYPES ==================================================
      type Query {
        lobby(_id: String!): Lobby
        trivia(triviaId: String!): Trivia
      }

      # INTERFACES ==================================================
      interface Response {
        name: String!
        uniqueId: String!
      }

      type MultipleChoiceResponse implements Response {
        name: String!
        uniqueId: String!
        roundNumber: Int!
        questionNumber: Int!
        response: Int!
      }

      type LightningResponse implements Response {
        name: String!
        uniqueId: String!
        roundNumber: Int!
        questionNumber: Int!
        response: String!
      }

      type PictureResponse implements Response {
        name: String!
        uniqueId: String!
        roundNumber: Int!
        questionNumber: String!
        response: String!
      }

      type TieBreakerResponse implements Response {
        name: String!
        uniqueId: String!
        roundType: String!
        response: Int!
      }

      interface Round {
        type: String!
        theme: String!
        pointValue: Int!
      }

      type LightningRound implements Round {
        type: String!
        theme: String!
        pointValue: Int!
        lightningQuestions: [LightningRoundQuestion]
      }

      type MultipleChoiceRound implements Round {
        type: String!
        theme: String!
        pointValue: Int!
        multipleChoiceQuestions: [MultipleChoiceRoundQuestion]
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

      type Lobby {
        _id: String!
        createdAt: String!
        triviaId: String!
        host: String!
        players: [Player]!
        responses: [Response]!
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

      type Player {
        name: String!
        uniqueId: String!
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
        lobby: async (root, { _id }) => {
          return lobbyCollection.findOne(ObjectId(_id))
        },
        trivia: async (root, { triviaId }) => {
          return triviaCollection.findOne({ triviaId: triviaId })
        }
      },
      Round: {
        __resolveType (obj) {
          if (obj.type === 'multipleChoice') {
            return 'MultipleChoiceRound'
          } else if (obj.type === 'lightning') {
            return 'LightningRound'
          } else if (obj.type === 'picture') {
            return 'PictureRound'
          }
        }
      },
      MultipleChoiceRound: { multipleChoiceQuestions: (round) => round.questions },
      LightningRound: { lightningQuestions: (round) => round.questions }
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
