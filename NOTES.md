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