import express from 'express'
import verifyToken from '../middlewares/verifyToken.js'
import verifyRefreshToken from '../middlewares/verifyRefreshToken.js'
import verifyRoles from '../middlewares/verifyRoles.js'
import { findBestWayBetweenWaypoints } from '../controllers/mapsController.js'

const router = express.Router()

router.get('/vehicle/:id/best-way', verifyRefreshToken, verifyToken, verifyRoles(['stocker']), findBestWayBetweenWaypoints)

export default router
