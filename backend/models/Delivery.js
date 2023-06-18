import mongoose from 'mongoose'

const deliverySchema = mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
  },
  type: {
    type: String,
    enum: ['inner', 'inter']
  }
}, { timestamps: true })

export default mongoose.model('Delivery', deliverySchema)