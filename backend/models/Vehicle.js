import mongoose from 'mongoose'

const vehicleSchema = mongoose.Schema({
  max_weight: Number,
  current_weight: {
    type: Number,
    default: 0
  },
  current_address_code: Number,
  from: Number,
  to: {
    type: String,
    enum: ["vung1", "vung2", "vung3", "vung4", "vung5", "vung6", "vung7"]
  },
  // to: [{
  //   type: Number
  // }],
  visitedStocks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stock'
  }],
  // waypoints: [{
  //   area_code: Number,
  //   district_code: Number
  // }],
  recommend_ways: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stock'
  }],
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
  type: String
})

export default mongoose.model('Vehicle', vehicleSchema)
