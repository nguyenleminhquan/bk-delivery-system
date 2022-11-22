import mongoose from 'mongoose'

const orderSchema = mongoose.Schema({
  weight: { type: Number, require: true },
  sender_address: { type: String, require: true },
  receiver_address: { type: String, require: true },
  payment_type: { type: String, require: true },
  cod_amount: { type: Number, require: true },
  note: String,
  status: String,
  shipping_fee: Number,
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  }]
})

export default mongoose.model('Order', orderSchema)