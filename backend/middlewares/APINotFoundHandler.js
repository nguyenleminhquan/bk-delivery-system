const APINotFoundHandler = (req, res, next) => {
  const error = new Error('API not found!')
  error.status = 400
  next(error)
}

export default APINotFoundHandler