import express from 'express'
import {  
  importOrderToStock,
  getOrderInStocks
} from '../controllers/stockController.js'
import verifyToken from '../middlewares/verifyToken.js'
import verifyRefreshToken from '../middlewares/verifyRefreshToken.js'
import verifyRoles from '../middlewares/verifyRoles.js'

const route = express.Router()

route.post('/', verifyRefreshToken, verifyToken, verifyRoles(['stocker']), importOrderToStock)
route.get('/:id/orders', verifyRefreshToken, verifyToken, verifyRoles(['stocker']), getOrderInStocks)

export default route