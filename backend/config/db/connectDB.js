import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const connectDB = async () => {
    try {
        console.log(process.env.MONGODB)
        await mongoose.connect(process.env.MONGODB)
        console.log('MongoDB connected!')
    } catch (error) {
        console.log(process.env.MONGODB)
        throw error
    }
}

export default connectDB