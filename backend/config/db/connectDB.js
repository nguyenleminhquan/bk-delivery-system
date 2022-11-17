import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB)
        console.log('MongoDB connected!')
    } catch (error) {
        throw error
    }
}

export default connectDB