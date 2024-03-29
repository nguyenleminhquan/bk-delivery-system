import express from 'express'
import {  
  importOrderToStock,
  getOrderInStocks,
  getAllStock,
  addStock,
  deleteStock,
  editStock,
  getImportHistory,
  getExportHistory,
  getAllVehicleAtStock,
  getAvailableOrderForVehicle
} from '../controllers/stockController.js'
import verifyToken from '../middlewares/verifyToken.js'
import verifyRefreshToken from '../middlewares/verifyRefreshToken.js'
import verifyRoles from '../middlewares/verifyRoles.js'

const route = express.Router()

route.get('/', verifyRefreshToken, verifyToken, verifyRoles(['admin']), getAllStock)
route.get('/:id/order', verifyRefreshToken, verifyToken, verifyRoles(['stocker']), getOrderInStocks)
route.get('/:stockId/import-history', verifyRefreshToken, verifyToken, verifyRoles(['stocker']), getImportHistory)
route.get('/:stockId/export-history', verifyRefreshToken, verifyToken, verifyRoles(['stocker']), getExportHistory)
route.get('/:stockId/vehicles', verifyRefreshToken, verifyToken, verifyRoles(['stocker']), getAllVehicleAtStock)
route.get('/:stockId/vehicle/:vehicleId/avail-orders', verifyRefreshToken, verifyToken, verifyRoles(['stocker']), getAvailableOrderForVehicle)

route.post('/', verifyRefreshToken, verifyToken, verifyRoles(['admin']), addStock)
route.post('/order', verifyRefreshToken, verifyToken, verifyRoles(['stocker']), importOrderToStock)

route.delete('/:id', verifyRefreshToken, verifyToken, verifyRoles(['admin']), deleteStock)

route.patch('/:id', verifyRefreshToken, verifyToken, verifyRoles(['admin']), editStock)

export default route