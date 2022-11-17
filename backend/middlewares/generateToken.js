import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const generateToken = (payload) => {
    try {
        var decode = jwt.sign(payload, process.env.SECRET, { expiresIn: process.env.SECRET_LIFE })
        return decode
    } catch (error) {
        next(error)
    }
}

export default generateToken