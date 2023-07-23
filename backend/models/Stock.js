import mongoose from 'mongoose'

const stockSchema = mongoose.Schema({
  name: {
    type: String
  },
  address: {
    type: String
  },
  area_code: {
    type: Number
  },
  district_code: {
    type: Number
  },
  lat: {
    type: Number
  },
  lon: {
    type: Number
  },
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }]
}, { timestamps: true })

export default mongoose.model('Stock', stockSchema)