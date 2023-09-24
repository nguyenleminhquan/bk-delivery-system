import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import errorHander from './middlewares/errorHandler.js'
import APINotFoundHandler from './middlewares/APINotFoundHandler.js'
import connectDB from './config/db/connectDB.js'
import { Server } from 'socket.io';
import { socketDelivery } from './controllers/deliveryController.js'

import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import deliveryRoutes from './routes/deliveryRoutes.js'
import stockRoutes from './routes/stockRoutes.js'
import vehicleRoutes from './routes/vehicleRoutes.js'
import mapRoutes from './routes/mapRoutes.js'
import exportInfoRoutes from './routes/exportInfoRoutes.js'
import supportRequestRoutes from './routes/supportRequestRoutes.js'
import { socketOrder } from './controllers/orderController.js'
import { socketSupportRequest } from './controllers/supportRequestController.js'

await connectDB()
dotenv.config()

import baseURLFrontend from './config/.env.json' assert { type: "json" }

const port = 5000
const app = express() 
// Fix cors error
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/user', userRoutes)
app.use('/order', orderRoutes)
app.use('/delivery', deliveryRoutes)
app.use('/stock', stockRoutes)
app.use('/vehicle', vehicleRoutes)
app.use('/exportinfo', exportInfoRoutes)
app.use('/support-request', supportRequestRoutes)
app.use('/maps', mapRoutes)

app.get('/', (req, res, next) => {
    res.send('API is running!')
})


app.use(APINotFoundHandler)
app.use(errorHander)

const server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})
const io = new Server(server, {
    cors: {
        origin: baseURLFrontend.baseURLFrontend,
        methods: ["GET", "POST"]
    }
});
socketDelivery(io)
socketOrder(io)
socketSupportRequest(io)


