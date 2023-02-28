import createError from 'http-errors'
import Order from '../models/Order.js'
import Item from '../models/Item.js'

// Create new order
const createOrder = async (req, res, next) => {
  // body:
  // user_id
  // list items: name, quantity, type, weight
  const bodyObj = req.body

  let newOrder = new Order({
    weight: 0,
    sender_address: bodyObj.sender_address,
    receiver_address: bodyObj.receiver_address,
    payment_type: bodyObj.payment_type,
    cod_amount: bodyObj.cod_amount,
    note: bodyObj.note,
    status: bodyObj.status,
    shipping_fee: bodyObj.shipping_fee,
    user_id: bodyObj.user_i
  })
  // Save order for getting _id
  await newOrder.save()

  // Push item into newOrder
  for (let i = 0; i < bodyObj.items.length; i++) {
    const item = new Item(bodyObj.items[i])
    item.order_id = newOrder._id
    // Save item
    await item.save()
    // Push item
    newOrder.items.push(item)
    newOrder.weight += bodyObj.items[i].weight
  }

  try {
    await newOrder.save()
    return res.json(newOrder)
  } catch (error) {
    next(error)
  }
}

// Get all order
const getAllOrder = async (req, res, next) => {
  const status = req.query.status;
  let data;
  if (status) {
    data = await Order.find({status: status})
  }
  else {
    data = await Order.find({})
  }
  return res.json(data)
}

// Get order by id
const getOrderById = async (req, res, next) => {
  try {
    let data = await Order.find({ _id: req.params.id })
      return res.json(data)
  } catch (error) {
    return next(createError(400))
  } 
}

// Get order by id
const getOrdersByUserId = async (req, res, next) => {
  try {
    let data = await Order.find({ user_id: req.params.userId })
    return res.json(data)
  } catch (error) {
    return next(createError(400))
  } 
}

// Delete order by id
const deleteOrderById = async (req, res, next) => {
  try {
    let data = await Order.findByIdAndDelete({ _id: req.params.id })
    return res.json({ msg: "Delete successfully!"})
  } catch (error) {
    return next(createError(400))
  }
}

// Edit order by id 
const editOrderById = async (req, res, next) => { 
  try {
    if (req.body.status) {
      return next(createError(400, 'User was not allowed to change status of order'))
    }
    let data = await Order.findByIdAndUpdate(req.params.id, req.body, {new: true})
    return res.json(data)
  } catch (error) {
    return next(createError(400))
  }
}

// Edit order status by id 
const editOrderStatusById = async (req, res, next) => { 
  try {
    let data = await Order.findByIdAndUpdate(req.params.id, {status: req.body.status}, {new: true})
    return res.json(data)
  } catch (error) {
    return next(createError(400))
  }
}

export {
  createOrder,
  getAllOrder,
  getOrderById,
  getOrdersByUserId,
  deleteOrderById,
  editOrderById,
  editOrderStatusById
}