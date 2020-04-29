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