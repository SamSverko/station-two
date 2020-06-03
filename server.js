// node
const path = require('path')
const bodyParser = require('body-parser')

// dependencies
require('dotenv').config()
const HOST = process.env.APP_HOST || 'localhost'
const PORT = process.env.APP_PORT || 4000
const express = require('express')
const app = express()
const helmet = require('helmet')
const cors = require('cors')
const compression = require('compression')
const { MongoClient } = require('mongodb')
const mongoSanitize = require('express-mongo-sanitize')
const graphqlHTTP = require('express-graphql')
const { addResolversToSchema, GraphQLFileLoader, loadSchemaSync } = require('graphql-tools')

// local files
// const router = require(path.join(__dirname, './api/routes'))

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

    const schema = loadSchemaSync(path.join(__dirname, '/graphql/schema/schema.graphql'), { loaders: [new GraphQLFileLoader()] })
    const { lobby } = require('./graphql/resolvers/queries/lobby')
    const { person } = require('./graphql/resolvers/queries/person')
    const { trivia } = require('./graphql/resolvers/queries/trivia')

    const resolvers = {
      Query: {
        lobby: lobby(app),
        person: person(app),
        persons: async () => {
          console.log('Query | persons')
          return app.get('db').collection(process.env.DB_COLLECTION_GRAPHQL).find({}).toArray()
        },
        trivia: trivia(app)
      },
      Mutation: {
        createPerson: async (root, args, context, info) => {
          const res = await app.get('db').collection(process.env.DB_COLLECTION_GRAPHQL).insertOne(args)
          return res.ops[0]
        }
      }
    }

    const schemaWithResolvers = addResolversToSchema({
      schema,
      resolvers
    })

    app.use('/graphql', graphqlHTTP({
      schema: schemaWithResolvers,
      graphiql: true
    }))
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

// turn app listening on
app.listen(PORT, () => {
  console.log(`Server successfully started app, listening at ${HOST}:${PORT}.`)
})
