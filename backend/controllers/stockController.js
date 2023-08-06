import createError from 'http-errors'
import Order from '../models/Order.js'
import Vehicle from '../models/Vehicle.js'
import User from '../models/User.js'
import Stock from '../models/Stock.js'
import ImportInfo from '../models/ImportInfo.js'
import { getOrderById } from './orderController.js'
import ExportInfo from '../models/ExportInfo.js'
import { getDomainFromString } from '../utils/order-utils.js'

const importOrderToStock = async (req, res, next) => {
  try {
    console.info("[API] Import order to stock")

    const { order_ids, stock_id, stocker_id, vehicle_id } = req.body
    await User.findById(stocker_id)

    const getOrders = async (ids) => {
      let orders = []
      for (let i = 0; i < ids.length; i++) {
        let order = await Order.findById(ids[i])
        orders.push(order)
      }
      return orders
    }
    
    let orders = await getOrders(order_ids)
    console.log(`--->Orders length: ${orders.length}`)
    let ordersLength = orders.length
    let invalidOrder = orders.some(order => 
          order.status != "arrived_send_stock" && order.status != "arrived_dest_stock")
    
    if (invalidOrder) {
      return next(createError(400, "Đơn hàng phải đến kho trước khi được nhập vào kho!"))
    }
      
    let stock = await Stock.findById(stock_id)
    let vehicle = await Vehicle.findById(vehicle_id)

    // Kiểm tra xem nhập tại kho gửi hay kho đích
    let isAtSendStock = orders.every(order => order.status == "arrived_send_stock")
    if (isAtSendStock) {
      console.info("--->Stock at: sender")  
      
      for (let i = 0; i < ordersLength; i++) {
        orders[i].status = "import"
        await orders[i].save()

        stock.orders.push(orders[i]._id)

        // Gỡ đơn hàng ra khỏi xe tải
        let orderIndexInVehicle = vehicle.orders.indexOf(orders[i]._id)
        if (orderIndexInVehicle !== -1) {
          console.info(`--->Remove order ${orders[i]._id} from vehicle`)
          vehicle.orders.splice(orderIndexInVehicle, 1)
          console.info(`--->Orders on vehicle after deleting: ${vehicle.orders}`)
        }
      }

      await vehicle.save()
    } else {
      console.info("--->Stock at: receiver")

      for (let i = 0; i < ordersLength; i++) {
        orders[i].status = "imported_dest_stock"
        await orders[i].save()

        // Gỡ đơn hàng ra khỏi xe tải
        let orderIndexInVehicle = vehicle.orders.indexOf(orders[i]._id)
        if (orderIndexInVehicle !== -1) {
          console.info(`--->Remove order ${orders[i]._id} from vehicle`)
          vehicle.orders.splice(orderIndexInVehicle, 1)
          console.info(`--->Orders on vehicle after deleting: ${vehicle.orders}`)
        }

        stock.orders.push(orders[i]._id)
      }

      await vehicle.save()
    }
    await stock.save()

    let importInfo = new ImportInfo({
      stocker_id,
      stock_id,
      orders: order_ids
    })
    await importInfo.save()
    
    return res.json(importInfo)
  } catch (error) {
    return next(createError(404))
  }
}

const getOrderInStocks = async (req, res, next) => {
  try {
    let importInfo = await ImportInfo.find({ stock_id: req.params.id })
    let order_ids = []
    importInfo.forEach(item => {
      item.orders.forEach(id => order_ids.push(id))
    })

    let orders = await Order.find({ _id: {$in: order_ids }, status: 'import' })
    
    return res.json(orders)
  } catch (error) {
    return next(createError(400))
  }
}

const addStock = async (req, res, next) => {
  try {
    const { area_code, district_code } = req.body
    // Check area_code is number
    if (typeof area_code != "number" || typeof district_code != "number") {
      return next(createError(400, 'Type of area_code and district_code must be number'))
    }

    // Check duplicate area_code
    let existStock = await Stock.find({ area_code, district_code })
    if (existStock != "") {
      return next(createError(400, 'The stock has been added'))
    }

    let newStock = new Stock(req.body)
    newStock = await newStock.save()

    return res.json(newStock)
  } catch (error) {
    return next(createError(400))
  }
}

const getAllStock = async (req, res, next) => {
  try {
    let allStock = await Stock.find()
    return res.json(allStock)
  } catch (error) {
    return next(createError(400))
  }
}

const deleteStock = async (req, res, next) => {
  try {
    const id = req.params.id
    let stock = await Stock.findByIdAndDelete(id)

    return res.json(stock)
  } catch (error) {
    return next(createError(400))
  }
}

const editStock = async (req, res, next) => {
  try {
    if (req.body.name || req.body.area_code) {
      return next(createError(400, 'You can\'t modify this field'))
    }

    await Stock.findByIdAndUpdate(req.params.id, { address: req.body.address })
    let afterUpdate = await Stock.findById(req.params.id)
    return res.json(await Stock.findById(req.params.id))
  } catch (error) {
    return next(createError(400))
  }
}

const getImportHistory = async(req, res, next) => {
  try {
    const stockId = req.params.stockId;
    const data = await ImportInfo
    .find({stock_id: stockId})
    .sort({ createdAt: -1 })
    .populate('stocker_id')
    .populate('stock_id')
    .populate({
      path: 'orders',
      populate: {
          path: 'items',
      }
    });;
    return res.json(data)
  } catch(error) {
    return next(createError(400))
  }
}

const getExportHistory = async(req, res, next) => {
  try {
    const stockId = req.params.stockId;
    const data = await ExportInfo
    .find({stock_id: stockId})
    .sort({ createdAt: -1 })
    .populate('stocker_id')
    .populate({
      path: 'orders',
      populate: {
          path: 'items',
      }
    });;
    return res.json(data)
  } catch(error) {
    console.log(error)
    return next(createError(400))
  }
}

const getAllVehicleAtStock = async (req, res, next) => {
  try {
    console.info("Get all vehicles at stock")
    let stock = await Stock.findById(req.params.stockId)
    let stockAreaCode = stock.area_code

    let allVehicles = await Vehicle.find({ from: stockAreaCode })

    return res.json(allVehicles)
  } catch (error) {
    console.log(error)
    return next(createError(400))
  }
}

const getAvailableOrderForVehicle = async (req, res, next) => {
  try {
    console.info("Get available order for vehicle at stock")
    const stockId = req.params.stockId
    const vehicleId = req.params.vehicleId
    
    let stock = await Stock.findById(stockId)
    let vehicle = await Vehicle.findById(vehicleId)
    
    if (vehicle.current_address_code != stock.area_code) {
      return next(createError(404, "Địa chỉ hiện tại của xe tải phải giống với kho!"))
    }

    let domainOfVehicle = vehicle.to
    const getOrders = async (orders) => {
      let result = []
      for (let i = 0; i < orders.length; i++) {
        let order = await Order.findById(orders[i])
        if (getDomainFromString(order.receiver_address) == domainOfVehicle) {
          result.push(order)
        }
      }
      return result
    }

    let result = await getOrders(stock.orders)
    
    return res.json(result)
  } catch (error) {
    console.log(error)
    return next(createError(400))
  }
}

export {
  importOrderToStock,
  getOrderInStocks,
  addStock,
  getAllStock,
  deleteStock,
  editStock,
  getAllVehicleAtStock,
  getAvailableOrderForVehicle,
  getImportHistory,
  getExportHistory
}
