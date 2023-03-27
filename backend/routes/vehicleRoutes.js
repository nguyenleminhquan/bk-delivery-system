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
  getAvailableOrderForVehicle
}  from '../controllers/vehicleController.js'

const router = express.Router()

router.get('/', verifyRefreshToken, verifyToken, verifyRoles(['admin', 'stocker']), getAllVehicle)
router.post('/', verifyRefreshToken, verifyToken, verifyRoles(['admin']), addVehicle)
router.get('/:id/order', verifyRefreshToken, verifyToken, verifyRoles(['stocker']), getAllOrdersByVehicle)
router.post('/:id/order', verifyRefreshToken, verifyToken, verifyRoles(['stocker']), pushOrderToVehicle)
router.delete('/order/:order_id', verifyRefreshToken, verifyToken, verifyRoles(['stocker']), deleteOrderFromVehicle)
router.get('/:id/avail-order', verifyRefreshToken, verifyToken, verifyRoles(['stocker']), getAvailableOrderForVehicle)
export default router
