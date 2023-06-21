import express from 'express'
import {   createOrder,
  deleteOrderById,
  editOrderById,
  editOrderStatusById,
  getAllOrder,
  getOrderById,
  getOrdersByUserId
} from '../controllers/orderController.js'
import verifyToken from '../middlewares/verifyToken.js'
import verifyRefreshToken from '../middlewares/verifyRefreshToken.js'
import verifyRoles from '../middlewares/verifyRoles.js'

const route = express.Router()

route.get('/', verifyRefreshToken, verifyToken, verifyRoles(['sender', 'driver_inner', 'driver_inter']), getAllOrder)
route.post('/', verifyRefreshToken, verifyToken, verifyRoles(['sender']), createOrder)
route.get('/user/:userId', verifyRefreshToken, verifyToken, verifyRoles(['sender']), getOrdersByUserId)
route.get('/:id', verifyRefreshToken, verifyToken, verifyRoles(['sender', 'driver_inner', 'driver_inter', 'stocker']), getOrderById)
route.delete('/:id', verifyRefreshToken, verifyToken, verifyRoles(['sender']), deleteOrderById)
route.patch('/:id', verifyRefreshToken, verifyToken, verifyRoles(['sender']), editOrderById)
route.patch('/:id/update-status', verifyRefreshToken, verifyToken, verifyRoles(['driver_inner', 'driver_inter']), editOrderStatusById)

export default route
