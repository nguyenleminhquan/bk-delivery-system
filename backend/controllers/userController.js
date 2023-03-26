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
    } else if (body.typeUser == "admin") {
        return next(createError(404, "Can not register account with admin role"))
    } 
    else {
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
                address: newUser.address,
                bank_account: exist.bank_account,
                working_days: newUser.working_days,
                area_code: newUser.area_code,
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
                address: exist.address,
                bank_account: exist.bank_account,
                working_days: exist.working_days,
                area_code: exist.area_code,
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
        const authHeader = req.header('Authorization');
        const token = authHeader && authHeader.split(' ')[2];
        const refresh_token = authHeader && authHeader.split(' ')[1];
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
                address: data.address,
                bank_account: data.bank_account,
                working_days: data.working_days,
                area_code: data.area_code,
                token, refresh_token
            },
            msg: "User updated!"
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const deleteUser = await User.findByIdAndDelete(req.params.id)

        return res.json(deleteUser)
    } catch (error) {
        return next(createError(400))
    }
}

const getAllEmployee = async (req, res, next) => {
    try {
        let allEmployee = await User.find({ 
            typeUser:{ $in: ['driver_inner', 'driver_inter', 'stocker'] }
        })

        return res.json(allEmployee)
    } catch (error) {
        return next(createError(400))
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

const testJWT = async(req, res, next) => {
    try {
        const user = await User.findOne({ email: req.email});
        return res.json({
            email: user.email,
            role: user.typeUser,
            msg: 'Authorized'
        })
    } catch(err) {
        console.log(err);
        next(err);
    }
}

const getWorkingDay = async (req, res, next) => {
    try {
        let user = await User.findOne({ email: req.email })
        if (user.typeUser === "admin") {
            let wd_stockers_drivers = await User.find({ typeUser: { $in: ['driver', 'stocker']}})
            return res.json(wd_stockers_drivers)
        } else {
            return res.json({working_days: user.working_days})
        }
    } catch (error) {
        return next(createError(404))
    }
}

const updateWorkingDays = async (req, res, next) => {
    try {
        const checkin = new Date(parseInt(req.body.time))
        const year = checkin.getFullYear()
        const month = checkin.getMonth()
        const date = checkin.getDate()

        let user = await User.findOne({ email: req.email })
        // If no data about working_days in database
        if (user.working_days.length == 0) {
            user.working_days.push({
                year: year,
                months: [{
                    month: month + 1,
                    days: [date]
                }]
            })
        } else {
            let yearIsExist = false
            let countYear = 0
            for (; countYear < user.working_days.length; countYear++) {
                if (user.working_days[countYear].year == year) {
                    yearIsExist = true
                    break
                }
            }

            // If has year
            if (yearIsExist) {
                let monthIsExist = false
                let countMonth = 0
                for (; countMonth < user.working_days[countYear].months.length; countMonth++) {
                    if (user.working_days[countYear].months[countMonth].month == (month + 1)) {
                        monthIsExist = true
                        break
                    }
                }

                // If has month
                if (monthIsExist) {
                    // Check duplicate date
                    let dayIsExist = false
                    let lengthDays = user.working_days[countYear].months[countMonth].days.length
                    for (let count = 0; count < lengthDays; count++) {
                        if (user.working_days[countYear].months[countMonth].days[count] == date) {
                            dayIsExist = true
                            break
                        }
                    }

                    if (dayIsExist) {
                        return next(createError(400, "You already checkin"))
                    }
                    user.working_days[countYear].months[countMonth].days.push(date)
                } else {
                    user.working_days[countYear].months.push({
                        month: month + 1,
                        days: [date]
                    })
                }
            } else {
                user.working_days.push({
                    year,
                    months: [{
                        month: month + 1,
                        days: [date]
                    }]
                })
            }

        }

        user = await user.save()

        return res.json({
            working_days: user.working_days,
            msg: "Successful"
        })

    } catch (error) {
        return next(createError(404, "Can not update working day"))
    }
}
export {
    userRegister,
    userLogin,
    refreshToken,
    updateUserInfo,
    changePassword,
    testJWT,
    getWorkingDay,
    updateWorkingDays,
    deleteUser,
    getAllEmployee
}
