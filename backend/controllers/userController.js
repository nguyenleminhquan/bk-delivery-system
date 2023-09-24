import createError from 'http-errors'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import generateToken from '../middlewares/generateToken.js'
import Stock from '../models/Stock.js'

const userRegister = async (req, res, next) => {
    const body = req.body
    // Tim tai khoan ton tai voi email
    let exist = ""
    if (body.email) {
        exist = await User.find({ email: body.email })
    }
    
    // Neu tai khoan ton tai
    if (exist != "" && exist) {
        return next(createError(400, "Email đã tồn tại!"))
    } else if (body.typeUser == "admin") {
        return next(createError(404, "Không thể đăng kí account với quyền admin!"))
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
                vehicle_id: newUser.vehicle_id,
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
                district_code: exist.district_code,
                stock_id: exist.stock_id,
                vehicle_id: exist.vehicle_id,
                token, refresh_token 
            }
            
            return res.json(data)
        } else {
            return next(createError(400, "Mật khẩu chưa đúng!"))
        }
    } else {
        return next(createError(400, "Không tìm thấy username!"))
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
                vehicle_id: data.vehicle_id,
                token, refresh_token
            },
            msg: "Cập nhật thông tin user thành công!"
        });
    } catch (err) {
        console.log(err);
        return next(createError(400));
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
                    msg: "Thay đổi mật khẩu thành công!"
                });
            } else {
                return next(createError(400, "Sai mật khẩu!"))
            }
        } else {
            return next(createError(400, "Không tìm thấy username!"))
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
                        return next(createError(400, "Bạn đã checkin!"))
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
            msg: "Cập nhật ngày làm việc thành công"
        })

    } catch (error) {
        return next(createError(404, "Không thể cập nhật ngày làm việc!"))
    }
}

const createAccount = async (req, res, next) => {
    const body = req.body
    // Tim tai khoan ton tai voi email
    let exist = ""
    if (body.email) {
        exist = await User.find({ email: body.email })
    }
    
    // Neu tai khoan ton tai
    if (exist != "" && exist) {
        return next(createError(400, "Email đã tồn tại!"))
    }
    else {
        try {
            // let stock = await Stock.find({area_code: body.area_code});
            const stocks = body.stocks;
            const stockId = stocks[0]._id;
            const area_code = stocks[0].area_code;
            const district_code = stocks.map((stock) => stock.district_code)
            const userInfo = {...body, stock_id: stockId, area_code: area_code, district_code: district_code};
            let newUser = new User(userInfo);
            newUser = await newUser.save()
            // Data tra ve
            const data = {
                id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                phone: newUser.phone,
                typeUser: newUser.typeUser,
                sender_address: newUser.sender_address,
                address: newUser.address,
                vehicle_id: newUser.vehicle_id,
                area_code: newUser.area_code,
                district_code: newUser.district_code,
                stock_id:  newUser.stock_id
            } 
            return res.json(data)
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}

const editAccount = async (req, res, next) => {
    try {
        const accountId = req.params.id;
        const info = req.body;
        const stocks = info.stocks;
        const stockId = stocks[0]._id;
        const area_code = stocks[0].area_code;
        const district_code = stocks.map((stock) => stock.district_code)
        const userInfo = {...info, stock_id: stockId, area_code: area_code, district_code: district_code};
        const updatedUser = await User.findByIdAndUpdate(
            accountId,
            userInfo,
            { new: true }
        );
        return res.json({ 
            data: {
                id: updatedUser._id,
                fullname: updatedUser.fullname,
                email: updatedUser.email,
                phone: updatedUser.phone,
                typeUser: updatedUser.typeUser,
                sender_address: updatedUser.sender_address,
                address: updatedUser.address,
                vehicle_id: updatedUser.vehicle_id,
                area_code: updatedUser.area_code,
                district_code: updatedUser.district_code,
                stock_id:  updatedUser.stock_id
            },
            msg: "Cập nhật thông tin người dùng thành công!"
        });
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
    changePassword,
    testJWT,
    getWorkingDay,
    updateWorkingDays,
    deleteUser,
    getAllEmployee,
    createAccount,
    editAccount
}
