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
    enum: ['waiting', 'accepted', 'picked', 'deliveried', 'success'],
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
  from_code: Number,
  to_code: Number,
  previous_type: {
    type: String,
    default: 'none'
  },
  type: {
    type: String,
    enum: ['inner_sender', 'inner_receiver', 'inter']
  },
}, { timestamps: true })

export default mongoose.model('Delivery', deliverySchema)