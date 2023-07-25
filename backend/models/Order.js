import mongoose from 'mongoose'
import moment from 'moment-timezone'

// const dateVietnam = moment.tz(Date.now(), "Asia/Ho_Chi_Minh")

const orderSchema = mongoose.Schema({
  weight: { type: Number },
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
    enum: ['waiting', 'accepted', 'picked', 'arrived_send_stock', 'import', 'on_vehicle', 'coming_dest_stock',
          'arrived_dest_stock', 'imported_dest_stock', 'delivering', 'success', 'cancel'],
    default: 'waiting'
  },
  tracking: {
    waiting: mongoose.Schema.Types.Date,
    accepted: mongoose.Schema.Types.Date,
    picked: mongoose.Schema.Types.Date,
    arrived_send_stock: mongoose.Schema.Types.Date,
    coming_dest_stock: mongoose.Schema.Types.Date,
    arrived_dest_stock: mongoose.Schema.Types.Date,
    delivering: mongoose.Schema.Types.Date,
    success: mongoose.Schema.Types.Date,
    cancel: mongoose.Schema.Types.Date,
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