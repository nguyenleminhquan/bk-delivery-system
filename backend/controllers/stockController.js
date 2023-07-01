import createError from 'http-errors'
import Order from '../models/Order.js'
import Item from '../models/Item.js'
import User from '../models/User.js'
import Stock from '../models/Stock.js'
import ImportInfo from '../models/ImportInfo.js'
import { getOrderById } from './orderController.js'
import ExportInfo from '../models/ExportInfo.js'

const importOrderToStock = async (req, res, next) => {
  try {
    // Support import multiple orders?
    let { order_id, stock_id, stocker_id } = req.body
    console.log(req.body)
    let order = await Order.findById(order_id)
    await User.findById(stocker_id)
    await Stock.findById(stock_id)

    // Change status of order to `import`
    order.status = 'import'
    await order.save()

    // Check the existence of importInfo with stock_id
    let importInfo = await ImportInfo.findOne({ stock_id })
    if (importInfo && importInfo.stocker_id == stocker_id) {
        importInfo.orders.push(order_id)
    } else {
      importInfo = new ImportInfo({
        stocker_id,
        stock_id,
        orders: [order_id]
      })
    }
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

    let orders = await Order.find({ _id: {$in: order_ids }, status: 'arrived_send_stock' })
    
    return res.json(orders)
  } catch (error) {
    return next(createError(402))
  }
}

const addStock = async (req, res, next) => {
  try {
    const { area_code } = req.body
    // Check area_code is number
    if (typeof area_code != "number") {
      return next(createError(400, 'Type of area_code must be number'))
    }

    // Check duplicate area_code
    let existStock = await Stock.find({ area_code })
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
    .populate('stocker_id')
    .populate('orders');
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
    .populate('stocker_id')
    .populate('orders');
    return res.json(data)
  } catch(error) {
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
  getImportHistory,
  getExportHistory
}
