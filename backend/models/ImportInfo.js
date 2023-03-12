import mongoose from 'mongoose'

const importInfoSchema = mongoose.Schema({
  stock_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stock'
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

export default mongoose.model('ImportInfo', importInfoSchema)