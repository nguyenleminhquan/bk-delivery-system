import mongoose, { mongo } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  typeUser: {
    type: String,
    enum: ['user', ,'sender', 'driver', 'stocker', 'admin'],
    default: 'user'
  },
  sender_address: String,
  bank_account: {
    bank_name: String,
    owner: String,
    account_number: String
  },
  working_days: [{
    year: Number,
    month: Number,
    date: [{ type: Date }]
  }],
  stock_id: String,
  vehicle: {
    type: String,
    license_plate_number: String
  }

})

userSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
})

export default mongoose.model('User', userSchema)