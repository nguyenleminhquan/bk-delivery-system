import createError from 'http-errors'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import generateToken from '../middlewares/generateToken.js'

const userRegister = async (req, res, next) => {
    const body = req.body
    // Tim tai khoan ton tai voi email
    let exist = ""
    if (body.email) {
        exist = await User.find({ email: body.email })
    }
    
    // Neu tai khoan ton tai
    if (exist != "" && exist) {
        return next(createError(400, "Email is exist"))
    } else {
        let newUser = new User(body)
        try {
            newUser = await newUser.save()
            const token = generateToken({ email: body.email })
            const refresh_token = jwt.sign({ email: body.email }, 
                process.env.SECRET_REFRESH, { expiresIn: process.env.SECRET_REFRESH_LIFE }) 
            // Data tra ve
            const data = {
                id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                phone: newUser.phone,
                typeUser: newUser.typeUser,
                sender_address: newUser.sender_address,
                working_days: newUser.working_days,
                token, refresh_token 
            }
            
            return res.json(data)

        } catch (error) {
            next(error)
        }
    }
}

const userLogin = async (req, res, next) => {
    const { email, password } = req.body

    const exist = await User.findOne({ email: email })

    if (exist) {
        const match = await bcrypt.compare(password, exist.password)

        // Neu mat khau match
        if (match) {
            // Tao token va refresh_token
            const token = generateToken({ email: exist.email })
            const refresh_token = jwt.sign({ email: exist.email }, 
                process.env.SECRET_REFRESH, { expiresIn: process.env.SECRET_REFRESH_LIFE }) 
            // Data tra ve
            const data = {
                id: exist._id,
                fullname: exist.fullname,
                email: exist.email,
                phone: exist.phone,
                typeUser: exist.typeUser,
                sender_address: exist.sender_address,
                working_days: exist.working_days,
                token, refresh_token 
            }
            
            return res.json(data)
        } else {
            return next(createError(400, "Password doesn't match"))
        }
    } else {
        return next(createError(400, "No username found"))
    }

}

// Refresh access token
const refreshToken = async (req, res) => {
    const body = req.body
    const token = generateToken({ email: body.email })
    return res.json({ token })
}

export {
    userRegister,
    userLogin,
    refreshToken
}