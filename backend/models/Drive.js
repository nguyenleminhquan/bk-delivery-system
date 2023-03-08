import mongoose from 'mongoose'

const driveSchema = mongoose.Schema({
  driver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  vehicle_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  }
})

export default mongoose.model('Drive', driveSchema)