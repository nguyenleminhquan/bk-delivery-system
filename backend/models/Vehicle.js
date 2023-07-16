import mongoose from 'mongoose'

const vehicleSchema = mongoose.Schema({
  max_weight: Number,
  current_weight: {
    type: Number,
    default: 0
  },
  current_address_code: Number,
  from: Number,
  to: Number,
  from_string: String,
  to_string: String,
  license_plate_number: String,
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
  driver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  area_code: {
    type: Number
  },
  exported: {
    type: Boolean,
    default: false
  },
  deliveries: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Delivery'
  }],
})

export default mongoose.model('Vehicle', vehicleSchema)