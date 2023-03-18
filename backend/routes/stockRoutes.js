import express from 'express'
import {  
  importOrderToStock,
  getOrderInStocks,
  getAllStock,
  addStock,
  deleteStock,
  editStock
} from '../controllers/stockController.js'
import verifyToken from '../middlewares/verifyToken.js'
import verifyRefreshToken from '../middlewares/verifyRefreshToken.js'
import verifyRoles from '../middlewares/verifyRoles.js'

const route = express.Router()

route.get('/', verifyRefreshToken, verifyToken, verifyRoles(['admin']), getAllStock)
route.post('/', verifyRefreshToken, verifyToken, verifyRoles(['admin']), addStock)
route.delete('/:id', verifyRefreshToken, verifyToken, verifyRoles(['admin']), deleteStock)
route.patch('/:id', verifyRefreshToken, verifyToken, verifyRoles(['admin']), editStock)
route.post('/order', verifyRefreshToken, verifyToken, verifyRoles(['stocker']), importOrderToStock)
route.get('/:id/order', verifyRefreshToken, verifyToken, verifyRoles(['stocker']), getOrderInStocks)

export default route