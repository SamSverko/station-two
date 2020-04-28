module.exports = {
  handleValidationError: (next, statusCode, title, method, location, details) => {
    const error = new Error()
    error.statusCode = statusCode
    error.title = title
    error.method = method
    error.location = location
    error.details = details
    return next(error)
  }
}
