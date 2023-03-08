import Vehicle from "../models/Vehicle.js"
import Drive from "../models/Drive.js"
import User from "../models/User.js"
import createError from 'http-errors'

const getAllVehicle = async (req, res, next) => {
  try {
    let allVehicle = await Vehicle.find({})

    return res.json(allVehicle)
  } catch (error) {
    return next(createError(error))
  }
}

const addVehicle = async (req, res, next) => {
  try {
    if (!(req.body.max_weight && req.body.from && req.body.to && req.body.license_plate_number)) {
      return next(createError(400, 'Please provide enough information!'))
    }
    
    const { license_plate_number } = req.body
    const existsVehicle = await Vehicle.findOne({ license_plate_number })
    if (existsVehicle) {
      return next(createError(400, 'Vehicle has been added!'))
    }

    let vehicle = new Vehicle(req.body)
    await vehicle.save()
    
    return res.json(vehicle)
  } catch (error) {
    return next(createError(error))
  }
}

export {
  getAllVehicle,
  addVehicle
}