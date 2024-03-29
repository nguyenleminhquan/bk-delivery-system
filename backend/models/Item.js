import mongoose from 'mongoose'

const itemSchema = mongoose.Schema({
  name: { type: String, require: true },
  weight: { type: Number, require: true },
  type: { type: String, require: true },
  order_id: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  weight: Number,
  quantity: String
}, { timestamps: true })

export default mongoose.model('Item', itemSchema)