import express from 'express'
import {   createOrder,
  deleteOrderById,
  editOrderById,
  editOrderStatusById,
  getAllOrder,
  getOrderById
} from '../controllers/orderController.js'
import verifyToken from '../middlewares/verifyToken.js'
import verifyRefreshToken from '../middlewares/verifyRefreshToken.js'
import verifyRoles from '../middlewares/verifyRoles.js'

const route = express.Router()

// Get all order
route.get('/', verifyRefreshToken, verifyToken, verifyRoles(['sender', 'driver']), getAllOrder)
route.post('/', verifyRefreshToken, verifyToken, verifyRoles(['sender']), createOrder)
route.get('/:id', verifyRefreshToken, verifyToken, verifyRoles(['sender', 'driver']), getOrderById)
route.delete('/:id', verifyRefreshToken, verifyToken, verifyRoles(['sender']), deleteOrderById)
route.patch('/:id', verifyRefreshToken, verifyToken, verifyRoles(['sender']), editOrderById)
route.patch('/:id/update-status', verifyRefreshToken, verifyToken, verifyRoles(['driver']), editOrderStatusById)

export default route