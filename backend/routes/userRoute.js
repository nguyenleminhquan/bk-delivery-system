import express from 'express'
import verifyToken from '../middlewares/verifyToken.js'
import verifyRefreshToken from '../middlewares/verifyRefreshToken.js'
import {
    userLogin,
    userRegister,
    refreshToken,
} from '../controllers/userController.js'

const route = express.Router()

route.post('/login', userLogin)
route.post('/register', userRegister)
// Lay access token moi
route.post('/token', verifyRefreshToken, refreshToken)
// Test JWT 
route.get('/test-jwt', verifyRefreshToken, verifyToken, (req, res) => {
    res.json({ email: req.email, msg: "Authenticate successfully!"})
})

export default route