import Vehicle from "../models/Vehicle.js"
import Stock from "../models/Stock.js"
import ExportInfo from "../models/ExportInfo.js"
import createError from 'http-errors'
import Order from "../models/Order.js"
import Delivery from "../models/Delivery.js"
import { getAreaCodeAndDistrictCodeFromString } from "../utils/order-utils.js"
// --------------------
// Utils
// --------------------
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

// ----------------------
// Controllers
// ----------------------
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
    if (!(req.body.max_weight && req.body.from && req.body.license_plate_number)) {
      return next(createError(400, 'Vui lòng cung cấp đủ thông tin!'))
    }
    
    const { license_plate_number } = req.body
    const existsVehicle = await Vehicle.findOne({ license_plate_number })
    if (existsVehicle) {
      return next(createError(400, 'Xe tải đã được thêm!'))
    }

    let vehicle = new Vehicle(req.body)
    vehicle.current_address_code = req.body.from
    await vehicle.save()
    
    return res.json(vehicle)
  } catch (error) {
    return next(createError(error))
  }
}

const pushOrderToVehicle = async (req, res, next) => {
  try {
    console.info('[API] Push order to vehicle')
    const { list_orders, stock_id } = req.body
    const vehicle_id = req.params.id
    let vehicle = await Vehicle.findById(vehicle_id)
    let stock = await Stock.findById(stock_id)

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
        return next(createError(400, 'Một hoặc nhiều đơn hàng đã được thêm vào xe tải!'))
      }

      let areaCodeDistrictCode = getAreaCodeAndDistrictCodeFromString(orders[i].sender_address)
      if (vehicle.type != "inner") {
        if (vehicle.from != areaCodeDistrictCode[0]) {
          return next(createError(400, 'Địa chỉ nơi gửi phải giống với nơi đi của xe tải!'))
        }
      }

      if (orders[i].status != 'import' && orders[i].status != 'imported_dest_stock') {
        return next(createError(400, 'Đơn hàng phải được nhập kho!'))
      }

      if ((vehicle.current_weight + orders[i].weight) > vehicle.max_weight) {
        return next(createError(400, 'Không thể thêm đơn hàng vì sức chứa xe tải đã đầy!'))
      }
      
      let orderIndexInStock = stock.orders.indexOf(orders[i]._id)
      if (orderIndexInStock !== -1) {
        console.info(`--->Stock.orders: ${stock.orders}`)
        console.info(`--->Order index: ${orderIndexInStock}`)
        stock.orders.splice(orderIndexInStock, 1)
        console.info("--->Delete order from stock")
        console.info(`--->Stock after deleting order: ${stock.orders}`)
      }

      vehicle.current_weight += orders[i].weight
      if (vehicle.type == "inner") {
        await Order.findByIdAndUpdate(orders[i]._id, {status: 'on_vehicle_dest_stock'})
      } else {
        await Order.findByIdAndUpdate(orders[i]._id, {status: 'on_vehicle'})
      }
      vehicle.orders.push(orders[i])
    }
    await stock.save()

    await vehicle.save()
    return res.json(vehicle)
  } catch (error) {
    return next(createError(400))
  }
}

const deleteOrderFromVehicle = async (req, res, next) => {
  try {
    const order_id = req.params.order_id
    let order = await Order.findById(order_id)
    const { vehicle_id, stock_id } = req.body
    let vehicle = await Vehicle.findById(vehicle_id)
    let stock = await Stock.findById(stock_id)

    if (!vehicle.orders.some(id => id == order_id)) {
      return next(createError(400, 'Đơn hàng không có trên xe tải!'))
    }

    for (let i = 0; i < vehicle.orders.length; i++) {
      if (vehicle.orders[i] == order_id) {
        let order = await Order.findById(order_id)
        vehicle.current_weight -= order.weight
      }
    }

    // Đưa đơn hàng trở lại vào kho
    stock.orders.push(order_id)
    await stock.save()
    
    vehicle.orders = vehicle.orders.filter(id => id != order_id)
    await vehicle.save()
    
    // Fix: update order status after deleting from vehicle
    if (order.status == "on_vehicle") {
      await Order.findByIdAndUpdate(order_id, { status: 'import' })
    } else {
      await Order.findByIdAndUpdate(order_id, { status: 'imported_dest_stock'})
    }

    return res.json(vehicle)
  } catch (error) {
    return next(createError(400))
  }
}

const getAllOrdersByVehicle = async (req, res, next) => {
  try {
    console.info("[API] Get all orders by vehicle")
    const vehicle_id = req.params.id
    let stockAreaCode = -1
    if ("filter" in req.query|| req.query.filter == "stock") {
      const stock_id = req.query.stock_id
      let stock = await Stock.findById(stock_id)
      stockAreaCode = stock.area_code
    }

    let vehicle = await Vehicle
    .findById(vehicle_id)
    .populate({
      path: 'orders',
      populate: {
          path: 'items',
      }
    });

    let result = vehicle.orders
    if (stockAreaCode != -1) {
      // Check if at sender stock or receiver stock
      let isAtSendStock = false
      isAtSendStock = result.every(order => order.status == "arrived_send_stock")
      
      console.log(`--->Is at sender stock: ${isAtSendStock}`)

      result = result.filter(order => {
        let orderAreaCode
        if (isAtSendStock) {
          orderAreaCode = getAreaCodeAndDistrictCodeFromString(order.sender_address)[0]
        } else {
          orderAreaCode = getAreaCodeAndDistrictCodeFromString(order.receiver_address)[0]
        }
        return orderAreaCode == stockAreaCode
      })
    }

    return res.json(result)
  } catch (error) {
    console.log(error)
    return next(createError(400))
  }
}

const getAvailableOrderForVehicle = async (req, res, next) => {
  try {
    const vehicle_id = req.params.id
    const vehicle = await Vehicle.findById(vehicle_id)

    const delivery = await Delivery.find({ 
      from_code: vehicle.from,
      to_code: vehicle.to,
      type: 'inner',
      status: 'deliveried'
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

const exportOrder = async (req, res, next) => {
  try {
    const body = req.body
    const vehicle_id = req.params.id
    // Send: vehicle_id, stocker_id
    const vehicle = await Vehicle.findById(vehicle_id).populate('orders')

    console.debug("vehicle")
    console.log(vehicle)

    let exportInfo = 
      new ExportInfo({ vehicle_id, stocker_id: body.stocker_id, orders: vehicle.orders, stock_id: body.stock_id })
    
    await exportInfo.save()

    return res.json(exportInfo)
  } catch (error) {
    return next(createError(400))
  }
}

const getVehicleById = async (req, res, next) => {
  try {
    const vehicle_id = req.params.id
    const vehicle = await Vehicle.findById(vehicle_id);
    return res.json({
      current_weight: vehicle.current_weight, 
      max_weight: vehicle.max_weight, 
      license_plate_number: vehicle.license_plate_number,
      deliveryCount: vehicle.deliveries.length,
      type: vehicle.type
    })
  } catch (error) {
    console.log(error);
    return next(createError(400))
  }
}

const getVehiclesInOrderManagement = async (req, res, next) => {
  try {
    const { type, area_code, district_code } = req.query;
    let vehicles;
    if (type === 'inter') {
      vehicles = await Vehicle.find({ type: 'inter', from: area_code }).populate('deliveries');
    } else {
      vehicles = await Vehicle.find({ type: {$regex: 'inner'}, from: area_code }).populate('deliveries');
      console.log('vehicles', vehicles)
      vehicles = vehicles.filter((vehicle) => {
        if (vehicle.deliveries.length !== 0 && vehicle.deliveries[0].type !== type) return false;
        return true;
      })
    }
    return res.json(vehicles);
  } catch (error) {
    console.log(error);
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
  filterVehicleByRoute,
  exportOrder,
  getAvailableOrderForVehicle,
  getVehicleById,
  getVehiclesInOrderManagement
}
