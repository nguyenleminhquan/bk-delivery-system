import mongoose from 'mongoose'

const deliverySchema = mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  driver_id: {
    type: mongoose.Schema.Types.ObjectId
  },
  status: {
    type: String,
    enum: ['waiting', 'accepted', 'picked', 'deliveried'],
    default: 'waiting'
  },
  area_code: {
    type: Number
  },
  from: {
    type: String
  },
  to: {
    type: String
  }
}, { timestamps: true })

export default mongoose.model('delivery', deliverySchema)