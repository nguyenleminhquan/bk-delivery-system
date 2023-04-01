import express from 'express'
import verifyToken from '../middlewares/verifyToken.js'
import verifyRefreshToken from '../middlewares/verifyRefreshToken.js'
import verifyRoles from '../middlewares/verifyRoles.js'
import {
    userLogin,
    userRegister,
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
} from '../controllers/userController.js'

const route = express.Router()

route.get('/employee', verifyRefreshToken, verifyToken, verifyRoles(['admin']), getAllEmployee)
route.post('/login', userLogin)
route.post('/register', userRegister)
route.post('/create-account', verifyRefreshToken, verifyToken, verifyRoles(['admin']), createAccount)
route.post('/edit-account/:id', verifyRefreshToken, verifyToken, verifyRoles(['admin']), editAccount)
// Lay access token moi
route.post('/token', verifyRefreshToken, refreshToken)
// Test JWT 
route.get('/test-jwt', verifyRefreshToken, verifyToken, testJWT)
route.post('/:id/update', verifyRefreshToken, verifyToken, updateUserInfo);
route.post('/:id/change-password', verifyRefreshToken, verifyToken, changePassword)
route.get('/working-day', verifyRefreshToken, verifyToken, verifyRoles(['admin', 'stocker', 'driver_inner', 'driver_inter']), getWorkingDay)
route.post('/working-day', verifyRefreshToken, verifyToken, verifyRoles(['stocker', 'driver_inner', 'driver_inter']), updateWorkingDays)
route.delete('/:id', verifyRefreshToken, verifyToken, verifyRoles(['admin']), deleteUser)

export default route