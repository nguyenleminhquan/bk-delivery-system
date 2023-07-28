import express from 'express'
import verifyToken from '../middlewares/verifyToken.js'
import verifyRefreshToken from '../middlewares/verifyRefreshToken.js'
import verifyRoles from '../middlewares/verifyRoles.js'
import { acceptDelivery, createDelivery, getAllDelivery, getDeliveryByStatus, getDeliveryHistory, updateDeliveryStatus } from '../controllers/deliveryController.js'

const route = express.Router()

// Get all delivery
route.get('/', verifyRefreshToken, verifyToken, verifyRoles(['driver_inner', 'driver_inter']), getDeliveryByStatus)
route.post('/', verifyRefreshToken, verifyToken, verifyRoles(['user', 'stocker', 'driver_inner', 'driver_inter']), createDelivery)
route.get('/all-delivery', verifyRefreshToken, verifyToken, verifyRoles(['user', 'stocker', 'driver_inner', 'driver_inter']), getAllDelivery)
route.get('/history/:driverId', verifyRefreshToken, verifyToken, verifyRoles(['driver_inner', 'driver_inter']), getDeliveryHistory)
route.patch('/:id/update-status', verifyRefreshToken, verifyToken, verifyRoles(['driver_inner', 'driver_inter']), updateDeliveryStatus)
route.patch('/:id/accept-delivery', verifyRefreshToken, verifyToken, verifyRoles(['driver_inner', 'driver_inter']), acceptDelivery)

export default route