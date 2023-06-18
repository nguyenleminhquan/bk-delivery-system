import express from 'express'
import verifyToken from '../middlewares/verifyToken.js'
import verifyRefreshToken from '../middlewares/verifyRefreshToken.js'
import verifyRoles from '../middlewares/verifyRoles.js'
import { 
  getAllVehicle,
  addVehicle,
  pushOrderToVehicle,
  deleteOrderFromVehicle,
  getAllOrdersByVehicle,
  getVehicleByRegion,
  searchVehicleWithCondition,
  filterVehicleByRoute,
  exportOrder
}  from '../controllers/vehicleController.js'

const router = express.Router()

router.get('/', verifyRefreshToken, verifyToken, verifyRoles(['admin', 'stocker']), getAllVehicle)
router.get('/search?', verifyRefreshToken, verifyToken, verifyRoles(['stocker']), filterVehicleByRoute)
router.get('/:id/order', verifyRefreshToken, verifyToken, verifyRoles(['stocker']), getAllOrdersByVehicle)
router.get('/region/:id', verifyRefreshToken, verifyToken, verifyRoles(['stocker']), getVehicleByRegion)
router.get('/region/:id/search?', verifyRefreshToken, verifyToken, verifyRoles(['stocker']), searchVehicleWithCondition)
router.post('/', verifyRefreshToken, verifyToken, verifyRoles(['admin']), addVehicle)
router.post('/:id/order', verifyRefreshToken, verifyToken, verifyRoles(['stocker']), pushOrderToVehicle)
router.post('/:id/export-order', verifyRefreshToken, verifyToken, verifyRoles(['stocker']), exportOrder)
router.delete('/order/:order_id', verifyRefreshToken, verifyToken, verifyRoles(['stocker']), deleteOrderFromVehicle)

export default router
