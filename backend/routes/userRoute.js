import express, { Router } from 'express'
import verifyToken from '../middlewares/verifyToken.js'
import verifyRefreshToken from '../middlewares/verifyRefreshToken.js'
import {
    userLogin,
    userRegister,
    refreshToken,
    updateUserInfo,
    changePassword,
    testJWT,
    getWorkingDay,
    getWorkingDayById 
} from '../controllers/userController.js'
import verifyRoles from '../middlewares/verifyRoles.js'

const route = express.Router()

route.post('/login', userLogin)
route.post('/register', userRegister)
// Lay access token moi
route.post('/token', verifyRefreshToken, refreshToken)
// Test JWT 
route.get('/test-jwt', verifyRefreshToken, verifyToken, testJWT)
route.post('/:id/update', verifyRefreshToken, verifyToken, updateUserInfo);
route.post('/:id/change-password', verifyRefreshToken, verifyToken, changePassword)
route.get('/working-day', verifyRefreshToken, verifyToken, verifyRoles(['admin', 'stocker', 'driver']), getWorkingDay)

export default route