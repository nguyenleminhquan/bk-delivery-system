import mongoose from 'mongoose';
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
  working_days: [{
    year: Number,
    month: Number,
    date: [{ type: Date }]
  }]
})

userSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
})

export default mongoose.model('User', userSchema)