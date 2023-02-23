import createError from 'http-errors'
import Delivery from '../models/Delivery.js';
import Stock from '../models/Stock.js';

const getDeliveryByStatus = async (req, res, next) => {
    try {
        const status = req.query.status;
        const area_code = req.query.area_code;
        const data = await Delivery.find({ status: status, area_code: area_code });
        return res.json(data);
    } catch (err) {
        console.log(err)
        return next(createError(400));
    }
}

const createDelivery = async (req, res, next) => {
    try {
        let { order_id, driver_id, status, area_code, from, to } = req.body;
        if (from.includes('stock_')) {
            let stock = await Stock.findOne({ area_code: from.slice(6, from.length) })
            from = stock.name + '&'  + stock.address
        }
        if (to.includes('stock_')) {
            let stock = await Stock.findOne({ area_code: to.slice(6, to.length) })
            to = stock.name + '&' + stock.address
        }
        let newDelivery = new Delivery({
            order: order_id,
            driver: driver_id,
            status: status,
            area_code: area_code,
            from: from,
            to: to
        })
        await newDelivery.save();
        return res.json(newDelivery);
    } catch (err) {
        console.log(err)
        return next(createError(400));
    }
}

const getDeliveryHistory = async (req, res, next) => {
    try {
        const id = req.params.driverId
        const delivery = await Delivery
        .find({ driver: id, status: 'deliveried' })
        .populate({
            path: 'order',
            populate: {
                path: 'items',
            }
        });
        return res.json(delivery);
    } catch (err) {
        console.log(err)
        return next(createError(400));
    }
}

const updateDeliveryStatus = async (req, res, next) => {
    try {
        let data = await Delivery.findByIdAndUpdate(req.params.id, {status: req.body.status}, {new: true})
        return res.json(data)
      } catch (error) {
        console.log(err)
        return next(createError(400))
    }
}

const acceptDelivery = async (req, res, next) => {
    try {
        const id = req.params.id;
        const driver_id = req.body.driver_id;
        const waitingDelivery = await Delivery.findById(id);
        if (waitingDelivery.status === 'waiting') {
            let data = await Delivery.findByIdAndUpdate(id, {status: 'accepted', driver: driver_id}, {new: true})
            return res.json(data)
        }
        else {
            return next(createError(400, "This delivery is accepted by other driver"))
        }
    } catch (err) {
        console.log(err)
        return next(createError(400))
    }
}

export { 
    getDeliveryByStatus, 
    createDelivery, 
    getDeliveryHistory,
    updateDeliveryStatus,
    acceptDelivery 
}