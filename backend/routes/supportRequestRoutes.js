import express from 'express'
import verifyToken from '../middlewares/verifyToken.js'
import verifyRefreshToken from '../middlewares/verifyRefreshToken.js'
import verifyRoles from '../middlewares/verifyRoles.js'
import { getAllSupportRequest } from '../controllers/supportRequestController.js'

const route = express.Router()

route.get('/', verifyRefreshToken, verifyToken, verifyRoles(['admin']), getAllSupportRequest)

export default route