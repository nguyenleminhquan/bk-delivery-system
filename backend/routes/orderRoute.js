import express from 'express'
import {   createOrder,
  getAllOrder,
  getOrderById
} from '../controllers/orderController.js'
import verifyToken from '../middlewares/verifyToken.js'
import verifyRefreshToken from '../middlewares/verifyRefreshToken.js'

const route = express.Router()

// Get all order
route.get('/order', verifyRefreshToken, verifyToken, getAllOrder)

export default route