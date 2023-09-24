import mongoose from 'mongoose'

const exportInfoSchema = mongoose.Schema({
  stock_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stock'
  },
  vehicle_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  },
  stocker_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  dest_stocks: [{
    stock_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stock'
    },
    orders: [{ 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    }],
  }],
  createTime: {
    type: Date
  }
}, { timestamps: true })

export default mongoose.model('ExportInfo', exportInfoSchema)