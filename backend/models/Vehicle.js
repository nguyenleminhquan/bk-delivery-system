import mongoose from 'mongoose'

const vehicleSchema = mongoose.Schema({
  max_weight: Number,
  current_weight: {
    type: Number,
    default: 0
  },
  from: String,
  to: String,
  license_plate_number: String,
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }]
})

export default mongoose.model('Vehicle', vehicleSchema)