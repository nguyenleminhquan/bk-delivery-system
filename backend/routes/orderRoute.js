import express from 'express'
import {   createOrder,
  getAllOrder,
  getOrderById
} from '../controllers/orderController.js'
import verifyToken from '../middlewares/verifyToken.js'
import verifyRefreshToken from '../middlewares/verifyRefreshToken.js'

const route = express.Router()

// Get all order
route.get('/', verifyRefreshToken, verifyToken, getAllOrder)
route.post('/', verifyRefreshToken, verifyToken, createOrder)
route.get('/:id', verifyRefreshToken, verifyToken, getOrderById)

export default route