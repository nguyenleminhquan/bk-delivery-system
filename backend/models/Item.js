import mongoose from 'mongoose'

const itemSchema = mongoose.Schema({
  name: { type: String, require: true },
  quantity: { type: Number, require: true },
  typeOrder: { type: String, require: true },
  belong_to: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }
})

export default mongoose.model('item', itemSchema)