import express from 'express'
import {   createOrder,
  deleteOrderById,
  editOrderById,
  getAllOrder,
  getOrderById
} from '../controllers/orderController.js'
import verifyToken from '../middlewares/verifyToken.js'
import verifyRefreshToken from '../middlewares/verifyRefreshToken.js'
import { isSender } from '../middlewares/verifyRoles.js'

const route = express.Router()

// Get all order
route.get('/', verifyRefreshToken, verifyToken, isSender, getAllOrder)
route.post('/', verifyRefreshToken, verifyToken, isSender, createOrder)
route.get('/:id', verifyRefreshToken, verifyToken, isSender, getOrderById)
route.delete('/:id', verifyRefreshToken, verifyToken, deleteOrderById)
route.patch('/:id', verifyRefreshToken, verifyToken, editOrderById)

export default route