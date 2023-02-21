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
  }
}, { timestamps: true })

export default mongoose.model('stock', stockSchema)