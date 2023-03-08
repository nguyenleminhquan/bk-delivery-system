import mongoose from 'mongoose'

const itemSchema = mongoose.Schema({
  name: { type: String, require: true },
  quantity: { type: Number, require: true },
  weight: { type: Number, require: true },
  type: { type: String, require: true },
  order_id: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }
}, { timestamps: true })

export default mongoose.model('Item', itemSchema)