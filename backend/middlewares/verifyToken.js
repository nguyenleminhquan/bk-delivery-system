import jwt from 'jsonwebtoken'
import createError from 'http-errors'

const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization')
    const token = authHeader && authHeader.split(' ')[2]

    if (!token) return next(createError(400, 'No access token') )
    try {
        var payload = jwt.verify(token, process.env.SECRET)
        req.email = payload.email
        next()
    } catch (error) {
        return next(createError(401, 'Access token expired'))        
    }
}

export default verifyToken