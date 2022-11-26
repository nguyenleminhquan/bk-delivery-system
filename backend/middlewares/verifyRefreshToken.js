import jwt from 'jsonwebtoken'
import createError from 'http-errors'

const verifyRefreshToken = (req, res, next) => {
    const authHeader = req.header('Authorization')
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) return next(createError(400, 'No refresh token') )
    try {
        var payload = jwt.verify(token, process.env.SECRET_REFRESH)
        req.email = payload.email
        next()
    } catch (error) {
        return next(createError(401, 'Refresh token expired'))        
    }
}

export default verifyRefreshToken