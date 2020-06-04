# notes

Random notes on things.

---

## Server error format

```javascript
{
  "statusCode": 422,
  "title": "Overview of what went wrong.",
  "method": "GET",
  "location": "/api/trivia/11s",
  "details": "This can be anything including a number, string, object, or array."
}
```

## MongoDB Atlas

`$filter` aggregation pipeline operator is not available on the free tier.

Working `$filter` example:
```javascript
req.app.db.collection(req.params.collection).aggregate([
  {
    $match: { triviaId: req.params.triviaId }
  },
  {
    $filter: {
      input: '$responses',
      as: 'response',
      cond: {
        $elemMatch: { '$$response.roundNumber': req.query.roundNumber }
      }
    }
  }
  ]).toArray((error, response) => {
    if (error) {
      res.send(error)
    } else {
      res.send(response)
    }
  })
```

## DB Schema

- triviaId's are limited to four alphabetical characters `a-z`.
- Player names are limited to between 3 and 10 (inclusive) alphanumeric characters `/^[a-z0-9]+$/i`.
- trivias are limited to 10 rounds.
- rounds are limited to 20 questions.
- scores can be floats between 0.0 and 10.0.

## GraphQL Queries

```
// returns one trivia
query {
  trivia(_id: "5e827a4e1c9d4400009fea32") {
    _id
    createdAt
    triviaId
    triviaPin
    host
    rounds {
      ... on LightningRound {
        questions {
          question
          answer
        }
      }
      ... on MultipleChoiceRound {
        questions {
          question
          options
          answerInt: answer
        }
      }
      ... on PictureRound {
        pictures {
          url
          answer
        }
      }
    }
    tieBreaker {
      question
      answer
    }
  }
}
```