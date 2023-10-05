import mongoose from 'mongoose'


const supportRequestSchema = mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    requester: {
        type: String,
        require: true
    },
    content: {
        type: String,
        default: ''
    },
    reply: {
        type: String,
        default: ''
    },
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle'
    }
}, { timestamps: true })

export default mongoose.model('SupportRequest', supportRequestSchema)