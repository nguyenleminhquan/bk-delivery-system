const errorHandler = (err, req, res, next) => {
  const statusCode = err.status == 200 ? 500 : err.status
  res.status(statusCode)
  res.json({
      status: err.status || 500,
      msg: err.message
  })
}

export default errorHandler