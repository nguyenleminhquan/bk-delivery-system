import createError from 'http-errors'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Order from '../models/Order.js'
import Item from '../models/Item.js'
import generateToken from '../middlewares/generateToken.js'

const createOrder = async (req, res, next) => {
  // body:
  // user_id
  // list items: name, quantity, type, weight
  const bodyObj = JSON.parse(req.body)

  let newOrder = new Order({
    weight: 0,
    sender_address: bodyObj.sender_address,
    receiver_address: bodyObj.receiver_address,
    payment_type: bodyObj.payment_type,
    cod_amount: bodyObj.cod_amount,
    note: bodyObj.note,
    status: bodyObj.status,
    shipping_fee: bodyObj.shipping_fee
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

  } catch (error) {
    next(error)
  }
}

const getAllOrder = async (req, res, next) => {
  const data = await Order.find({})
  return res.json(data)
}

const getOrderById = async (req, res, next) => {
  const data = await Order.find({ _id: req.body.id })
  if (data) {
    return res.json(data)
  }
  return next(createError(400))
}

export {
  createOrder,
  getAllOrder,
  getOrderById
}