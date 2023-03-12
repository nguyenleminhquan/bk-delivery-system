import createError from 'http-errors'
import Order from '../models/Order.js'
import Item from '../models/Item.js'
import User from '../models/User.js'
import Stock from '../models/Stock.js'
import ImportInfo from '../models/ImportInfo.js'
import { getOrderById } from './orderController.js'

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

    let orders = await Order.find({ _id: {$in: order_ids }})
    
    return res.json(orders)
  } catch (error) {
    return next(createError(402))
  }
}

export {
  importOrderToStock,
  getOrderInStocks
}