import mongoose, { mongo } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  typeUser: {
    type: String,
    enum: ['user', ,'sender', 'driver_inner', 'driver_inter', 'stocker', 'admin'],
    default: 'user'
  },
  sender_address: String,
  address: String,
  bank_account: {
    bank_name: String,
    owner: String,
    account_number: String
  },
  working_days: [{
    _id: false,
    year: Number,
    months: [{
      _id: false,
      month: Number,
      days: [Number]
    }]
  }],
  stock_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stock'
  },
  vehicle: {
    type: String,
    license_plate_number: String
  },
  area_code: {
    type: Number
  }
})

userSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
})

export default mongoose.model('User', userSchema)