import createError from 'http-errors'
import Order from '../models/Order.js'
import Item from '../models/Item.js'
import {
  getAreaCodeAndDistrictCodeFromString
} from '../utils/order-utils.js'

// Create new order
const createOrder = async (req, res, next) => {
  // body:
  // user_id
  // list items: name, quantity, type, weight
  const bodyObj = req.body

  let parseReceiver = bodyObj.receiver_address.split(", ")
  let length_parseReceiver = parseReceiver.length
  let receiver_area_address = parseReceiver[length_parseReceiver - 1]
  let receiver_district_address = parseReceiver[length_parseReceiver - 2]

  let newOrder = new Order({
    weight: bodyObj.weight,
    sender_address: bodyObj.sender_address,
    sender_name: bodyObj.sender_name,
    sender_phone: bodyObj.sender_phone,
    receiver_address: bodyObj.receiver_address,
    receiver_name: bodyObj.receiver_name,
    receiver_phone: bodyObj.receiver_phone,
    payment_type: bodyObj.payment_type,
    cod_amount: bodyObj.cod_amount,
    note: bodyObj.note,
    status: bodyObj.status,
    shipping_fee: bodyObj.shipping_fee,
    user_id: bodyObj.user_id
  })

  // Parse thong tin de lay code cua noi den
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
    let data = await Order
    .find({ user_id: req.params.userId })
    .populate({
      path: 'items'
    })
    .sort({ createdAt: -1 })
    return res.json(data)
  } catch (error) {
    return next(createError(400))
  } 
}

// Delete order by id
const deleteOrderById = async (req, res, next) => {
  try {
    let data = await Order.findByIdAndDelete({ _id: req.params.id })
    return res.json({ msg: "Xoá đơn hàng thành công!"})
  } catch (error) {
    return next(createError(400))
  }
}

// Edit order by id 
const editOrderById = async (req, res, next) => { 
  try {
    if (req.body.status) {
      return next(createError(400, 'Người dùng không đủ quyền để cập nhật status của đơn hàng!'))
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

const socketOrder = (io) => {
  io.on('connection', async (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    })
    socket.on('message', (msg) => {
        console.log("message: ", msg);
        io.emit('message', msg);
    })
    socket.on('updateOrderStatus', async(data) => {
      console.log('data', data);
      const { order_id, status, date } = data;
      let changedOrder = await Order.findById(order_id);
      changedOrder.status = status;
      if (status === 'cancel') {
        changedOrder.tracking = {}
      }
      else {
        changedOrder.tracking[status] = date;
      }
      await changedOrder.save();
      io.emit('updateOrderStatus', data);
    })
    socket.on('deleteOrder', async(data) => {
      const { order_id } = data;
      await Order.findByIdAndDelete(order_id)
      io.emit('deleteOrder', data);
    })
  });
}

export {
  createOrder,
  getAllOrder,
  getOrderById,
  getOrdersByUserId,
  deleteOrderById,
  editOrderById,
  editOrderStatusById,
  socketOrder
}