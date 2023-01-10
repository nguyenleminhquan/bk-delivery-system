import mongoose from 'mongoose'

const deliverySchema = mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  driver_id: {
    type: mongoose.Schema.Types.ObjectId
  }
}, { timestamps: true })

export default mongoose.model('delivery', deliverySchema)