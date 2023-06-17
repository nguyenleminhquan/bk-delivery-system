import Vehicle from "../models/Vehicle.js"
import Drive from "../models/Drive.js"
import User from "../models/User.js"
import createError from 'http-errors'
import Order from "../models/Order.js"
import Delivery from "../models/Delivery.js"



const getAllVehicle = async (req, res, next) => {
  try {
    let allVehicle = await Vehicle.find({}).populate('orders').populate('driver_id')

    return res.json(allVehicle)
  } catch (error) {
    return next(createError(error))
  }
}

const addVehicle = async (req, res, next) => {
  try {
    if (!(req.body.max_weight && req.body.from && req.body.to && req.body.license_plate_number && req.body.driver_id)) {
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
    const { list_orders } = req.body
    const vehicle_id = req.params.id
    let vehicle = await Vehicle.findById(vehicle_id)
    const getOrdersByListID = async (list_orders) => {
      let orders = []
      for (let i = 0; i < list_orders.length; i++) {
        orders.push(await Order.findById(list_orders[i]))
      }
      return orders
    }
    let orders = await getOrdersByListID(list_orders)
    for (let i = 0; i < orders.length; i++) {
      if (vehicle.orders.some(id => id == orders[i]._id.toString())) {
        return next(createError(400, 'The order has been pushed to the vehicle'))
      }

      if (orders[i].status != 'import') {
        return next(createError(400, 'The order has not been imported'))
      }

      if ((vehicle.current_weight + orders[i].weight) > vehicle.max_weight) {
        return next(createError(400, 'The order weight exceeds the maximum vehicle weight'))
      }
      vehicle.current_weight += orders[i].weight
      await Order.findByIdAndUpdate(orders[i]._id, {status: 'on_vehicle'})
      vehicle.orders.push(orders[i])
    }

    await vehicle.save()
    return res.json(vehicle)
  } catch (error) {
    return next(createError(400))
  }
}

const deleteOrderFromVehicle = async (req, res, next) => {
  try {
    const order_id = req.params.order_id
    const { vehicle_id } = req.body
    let vehicle = await Vehicle.findById(vehicle_id)

    if (!vehicle.orders.some(id => id == order_id)) {
      return next(createError(400, 'The order is not on the vehicle'))
    }

    for (let i = 0; i < vehicle.orders.length; i++) {
      if (vehicle.orders[i] == order_id) {
        let order = await Order.findById(order_id)
        vehicle.current_weight -= order.weight
      }
    }

    vehicle.orders = vehicle.orders.filter(id => id != order_id)
    await vehicle.save()

    return res.json(vehicle)
  } catch (error) {
    return next(createError(400))
  }
}

const getAllOrdersByVehicle = async (req, res, next) => {
  try {
    const vehicle_id = req.params.id

    let vehicle = await Vehicle.findById(vehicle_id).populate('orders')

    return res.json(vehicle.orders)
  } catch (error) {
    return next(createError(400))
  }
}

const getAvailableOrderForVehicle = async (req, res, next) => {
  try {
    const vehicle_id = req.params.id
    const vehicle = await Vehicle.findById(vehicle_id)

    const delivery = await Delivery.find({ 
      area_code: vehicle.area_code, 
      type: 'inner',
      status: 'deliveried',
    })

    const listOrderIds = delivery.map(item => item.order._id)

    const availOrders = await Order.aggregate([
      {
        $match: { 
          $and: [
            { _id: { $in: listOrderIds } },
            { status: { $regex: /import/ } }
          ]
        }
      }
    ]).exec()

    return res.json(availOrders)
  } catch (error) {
    return next(createError(400))
  }
}

const getVehicleByRegion = async (req, res, next) => {
  try {
    const region = req.params.id

    const allVehicleByRegion = await Vehicle.find({ current_address_code: region })

    return res.json(allVehicleByRegion)
  } catch (error) {
    return next(createError(400))
  }
}

async function searchWithSpecificRegion(region_code, queries) {
  let result = []

  if ("exported" in queries) {
    let vehicles = await 
            Vehicle.find({ current_address_code: region_code, exported: queries['exported']})
    result.push(vehicles)
  }
  
  return result.flat()
}

async function searchVehicle(queries) {
  let result = []

  if ("from" in queries && "to" in queries) {
    let vehicles = await Vehicle.find({ from: queries['from'], to: queries['to'] })
    result.push(vehicles)
  }

  return result.flat()
}

const searchVehicleWithCondition = async (req, res, next) => {
  try {
    const region_code = req.params.id

    const result = await searchWithSpecificRegion(region_code, req.query)

    return res.json(result)
  } catch (error) {
    return next(createError(400))
  }
}

const filterVehicleByRoute = async (req, res, next) => {
  try {
    let result = await searchVehicle(req.query)    

    return res.json(result)
  } catch (error) {
    return next(createError(400))
  }
}

export {
  getAllVehicle,
  addVehicle,
  pushOrderToVehicle,
  deleteOrderFromVehicle,
  getAllOrdersByVehicle,
  getVehicleByRegion,
  searchVehicleWithCondition,
  filterVehicleByRoute
}