import Vehicle from "../models/Vehicle.js"
import Drive from "../models/Drive.js"
import User from "../models/User.js"
import createError from 'http-errors'
import Order from "../models/Order.js"

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

const pushOrderToVehicle = async (req, res, next) => {
  try {
    const { vehicle_id, order_id } = req.body
    let vehicle = await Vehicle.findById(vehicle_id)
    let order = await Order.findById(order_id)

    // Check if the order status isn't import
    if (order.status != 'import') {
      return next(createError(400, 'The order has not been imported'))
    }

    if ((vehicle.current_weight + order.weight) > vehicle.max_weight) {
      return next(createError(400, 'The order weight exceeds the maximum vehicle weight'))
    }

    vehicle.current_weight += order.weight
    vehicle.orders.push(order)
    await vehicle.save()

    return res.json(vehicle)
  } catch (error) {
    return next(createError(400))
  }
}

export {
  getAllVehicle,
  addVehicle,
  pushOrderToVehicle
}