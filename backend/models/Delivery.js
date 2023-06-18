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
  from: Number,
  to: Number,
  from_string: String,
  to_string: String,
  previous_type: {
    type: String,
    default: 'none'
  },
  type: {
    type: String,
    enum: ['inner', 'inter']
  }
}, { timestamps: true })

export default mongoose.model('Delivery', deliverySchema)