import express from 'express'
import verifyToken from '../middlewares/verifyToken.js'
import verifyRefreshToken from '../middlewares/verifyRefreshToken.js'
import verifyRoles from '../middlewares/verifyRoles.js'
import { 
  downloadExportInfo,
}  from '../controllers/exportInfoController.js'

const router = express.Router()

router.get('/:id/download', verifyRefreshToken, verifyToken, verifyRoles(['admin', 'stocker']), downloadExportInfo)

export default router
