import express from 'express'
import dotenv from 'dotenv'
import errorHander from './middlewares/errorHandler.js'
import APINotFoundHandler from './middlewares/APINotFoundHandler.js'
import connectDB from './config/db/connectDB.js'

import userRoutes from './routes/userRoute.js'

connectDB()
dotenv.config()

const port = 5000
const app = express() 

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/user', userRoutes)

app.get('/', (req, res, next) => {
    res.send('API is running!')
})


app.use(APINotFoundHandler)
app.use(errorHander)

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})


