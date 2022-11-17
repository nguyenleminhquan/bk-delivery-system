import jwt from 'jsonwebtoken'
import createError from 'http-errors'

const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization')
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) return next(createError(401, 'No authorization!') )
    try {
        var payload = jwt.verify(token, process.env.SECRET)
        req.email = payload.email
        next()
    } catch (error) {
        return next(createError(403, 'No authorization'))        
    }
}

export default verifyToken