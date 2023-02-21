import express from 'express'
import verifyToken from '../middlewares/verifyToken.js'
import verifyRefreshToken from '../middlewares/verifyRefreshToken.js'
import verifyRoles from '../middlewares/verifyRoles.js'
import { acceptDelivery, createDelivery, getDeliveryByStatus, getDeliveryHistory, updateDeliveryStatus } from '../controllers/deliveryController.js'

const route = express.Router()

// Get all delivery
route.get('/', verifyRefreshToken, verifyToken, verifyRoles(['driver']), getDeliveryByStatus)
route.post('/', verifyRefreshToken, verifyToken, verifyRoles(['user', 'stocker', 'driver']), createDelivery)
route.get('/history/:driverId', verifyRefreshToken, verifyToken, verifyRoles(['driver']), getDeliveryHistory)
route.patch('/:id/update-status', verifyRefreshToken, verifyToken, verifyRoles(['driver']), updateDeliveryStatus)
route.patch('/:id/accept-delivery', verifyRefreshToken, verifyToken, verifyRoles(['driver']), acceptDelivery)

export default route