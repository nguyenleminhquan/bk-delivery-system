import express from 'express'
import verifyToken from '../middlewares/verifyToken.js'
import verifyRefreshToken from '../middlewares/verifyRefreshToken.js'
import verifyRoles from '../middlewares/verifyRoles.js'
import { 
  getAllVehicle,
  addVehicle,
  pushOrderToVehicle 
}  from '../controllers/vehicleController.js'

const router = express.Router()

router.get('/', verifyRefreshToken, verifyToken, verifyRoles(['admin', 'stocker']), getAllVehicle)
router.post('/', verifyRefreshToken, verifyToken, verifyRoles(['admin']), addVehicle)
router.post('/order', verifyRefreshToken, verifyToken, verifyRoles(['stocker']), pushOrderToVehicle)

export default router
