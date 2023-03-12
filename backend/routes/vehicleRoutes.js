import express from 'express'
import verifyToken from '../middlewares/verifyToken.js'
import verifyRefreshToken from '../middlewares/verifyRefreshToken.js'
import verifyRoles from '../middlewares/verifyRoles.js'
import { 
  getAllVehicle,
  addVehicle,
  pushOrderToVehicle,
  deleteOrderFromVehicle
}  from '../controllers/vehicleController.js'

const router = express.Router()

router.get('/', verifyRefreshToken, verifyToken, verifyRoles(['admin', 'stocker']), getAllVehicle)
router.post('/', verifyRefreshToken, verifyToken, verifyRoles(['admin']), addVehicle)
router.post('/order', verifyRefreshToken, verifyToken, verifyRoles(['stocker']), pushOrderToVehicle)
router.delete('/order/:order_id', verifyRefreshToken, verifyToken, verifyRoles(['stocker']), deleteOrderFromVehicle)

export default router
