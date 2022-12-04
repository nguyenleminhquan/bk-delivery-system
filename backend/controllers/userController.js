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
                bank_account: exist.bank_account,
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
                bank_account: exist.bank_account,
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

const updateUserInfo = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const info = req.body;
        const data = await User.findByIdAndUpdate(
            userId,
            info,
            { new: true }
        );
        return res.json({ 
            data: {
                id: data._id,
                fullname: data.fullname,
                email: data.email,
                phone: data.phone,
                typeUser: data.typeUser,
                sender_address: data.sender_address,
                bank_account: data.bank_account,
                working_days: data.working_days,
            },
            msg: "User updated!"
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
}

const changePassword = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const { oldPass, newPass } = req.body;
        const exist = await User.findById(userId)

        if (exist) {
            const match = await bcrypt.compare(oldPass, exist.password)
            if (match) {
                exist.password = newPass;
                await exist.save();
                return res.json({ 
                    data: "",
                    msg: "Change password successfully!"
                });
            } else {
                return next(createError(400, "Wrong password!"))
            }
        } else {
            return next(createError(400, "No username found"))
        }
        
    } catch (err) {
        console.log(err);
        next(err);
    }
}

export {
    userRegister,
    userLogin,
    refreshToken,
    updateUserInfo,
    changePassword
}