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
  exportOrder,
  getAvailableOrderForVehicle,
  getVehicleById,
  getVehiclesInOrderManagement
}  from '../controllers/vehicleController.js'
import { findBestWayBetweenWaypoints } from '../controllers/mapsController.js'

const router = express.Router()

router.get('/', verifyRefreshToken, verifyToken, verifyRoles(['admin', 'stocker']), getAllVehicle)
router.get('/specific', verifyRefreshToken, verifyToken, verifyRoles(['admin']), getVehiclesInOrderManagement)
router.get('/:id', verifyRefreshToken, verifyToken, verifyRoles(['driver_inner', 'driver_inter']), getVehicleById)
router.get('/:id/order?', verifyRefreshToken, verifyToken, verifyRoles(['stocker']), getAllOrdersByVehicle)
// router.get('/:id/avail-order', verifyRefreshToken, verifyToken, verifyRoles(['stocker']), getAvailableOrderForVehicle)
// router.get('/region/:id', verifyRefreshToken, verifyToken, verifyRoles(['stocker']), getVehicleByRegion)
router.get('/region/:id/search?', verifyRefreshToken, verifyToken, verifyRoles(['stocker']), searchVehicleWithCondition)
router.get('/search?', verifyRefreshToken, verifyToken, verifyRoles(['stocker']), filterVehicleByRoute)
router.get('/:id/best-way', verifyRefreshToken, verifyToken, verifyRoles(['stocker, driver']), findBestWayBetweenWaypoints)

router.post('/', verifyRefreshToken, verifyToken, verifyRoles(['admin']), addVehicle)
router.post('/:id/order', verifyRefreshToken, verifyToken, verifyRoles(['stocker']), pushOrderToVehicle)
router.post('/:id/export-order', verifyRefreshToken, verifyToken, verifyRoles(['stocker']), exportOrder)

router.delete('/order/:order_id', verifyRefreshToken, verifyToken, verifyRoles(['stocker']), deleteOrderFromVehicle)

export default router
