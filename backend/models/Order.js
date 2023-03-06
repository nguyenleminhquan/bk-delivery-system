import mongoose from 'mongoose'
import moment from 'moment-timezone'

// const dateVietnam = moment.tz(Date.now(), "Asia/Ho_Chi_Minh")

const orderSchema = mongoose.Schema({
  weight: { type: Number, require: true },
  sender_address: { type: String, require: true },
  sender_name: { type: String, require: true },
  sender_phone: { type: String, require: true },
  receiver_address: { type: String, require: true },
  receiver_name: { type: String, require: true },
  receiver_phone: { type: String, require: true },
  payment_type: { type: String, require: true },
  cod_amount: { type: Number },
  note: String,
  shipping_fee: Number,
  status: {
    type: String,
    enum: ['waiting', 'picking', 'picking_success', 'import', 'classify', 
    'transshipment', 'delivery', 'delivery_success', 'delivery_failed',
    'resending_waiting', 'damaged', 'delivery_back', 'contact_waiting'],
    default: 'waiting'
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  }],
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true })

export default mongoose.model('Order', orderSchema)