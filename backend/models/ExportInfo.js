import mongoose from 'mongoose'

const exportInfoSchema = mongoose.Schema({
  vehicle_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  },
  stocker_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  orders: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
  createTime: {
    type: Date
  }
}, { timestamps: true })

export default mongoose.model('ExportInfo', exportInfoSchema)