import createError from 'http-errors'
import Delivery from '../models/Delivery.js';
import Stock from '../models/Stock.js';
import Vehicle from '../models/Vehicle.js';
import Order from '../models/Order.js';

const getDeliveryByStatus = async (req, res, next) => {
    try {
        const status = req.query.status;
        const area_code = req.query.area_code;
        const type = req.query.type;
        const data = await Delivery.
        find({ status: status, area_code: area_code, type: type })
        .populate({
            path: 'order',
            populate: {
                path: 'items',
            }
        });;
        return res.json(data);
    } catch (err) {
        console.log(err)
        return next(createError(400));
    }
}

const createDelivery = async (req, res, next) => {
    try {
        let { order_id, driver_id, status, area_code, from, to, type, from_code, to_code } = req.body;
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
            to: to,
            type: type,
            from_code: from_code,
            to_code: to_code
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
        .sort({ createdAt: -1 })
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

const socketDelivery = (io) => {
    io.on('connection', async (socket) => {
        console.log('a user connected');
        socket.on('disconnect', () => {
            console.log('user disconnected');
        })
        socket.on('message', (msg) => {
            console.log("message: ", msg);
            io.emit('message', msg);
        })
        socket.on('newDeliveries', async(deliveries) => {
            let deliveriesResponse = [];
            for (let data of deliveries) {
                let { status, area_code, district_code, order_id, driver_id, type, from, to, from_code, to_code } = data;
                if (from.includes('stock_')) {
                    let stock = await Stock.findOne({ area_code: from.slice(6, from.length) })
                    from = stock.name + '&'  + stock.address
                }
                if (to.includes('stock_')) {
                    let stock = await Stock.findOne({ area_code: to.slice(6, to.length) })
                    to = stock.name + '&' + stock.address
                }
                // save new delivery
                let newDelivery = new Delivery({
                    order: order_id,
                    driver: driver_id,
                    status: status,
                    area_code: area_code,
                    district_code: district_code,
                    from: from,
                    to: to,
                    type: type,
                    from_code: from_code,
                    to_code: to_code
                })
                let res = await newDelivery.save();
                let delivery = await Delivery
                .findById(res._id)
                .populate({
                    path: 'order',
                    populate: {
                        path: 'items',
                    }
                });
                deliveriesResponse.push(delivery);
            }
            io.emit('newDeliveries', deliveriesResponse)
        })
        socket.on('allDeliveries', async(data) => {
            let deliveries = [];
            // get deliveries in vehicle
            const { vehicle_id, area_code, district_code, type } = data;
            const vehicleInfo = await Vehicle
            .findById(vehicle_id)
            .populate({
                path: 'deliveries',
                populate: {
                    path: 'order',
                    populate: {
                        path: 'items'
                    }
                }
            })
            deliveries.push(...vehicleInfo?.deliveries);
            // get waiting deliveries
            let waitingDeliveries = await Delivery
            .find({ status: 'waiting', area_code: area_code, district_code: district_code, type: {$regex: type} })
            .populate({
                path: 'order',
                populate: {
                    path: 'items',
                }
            })
            if (vehicleInfo?.deliveries.length > 0) {
                waitingDeliveries = waitingDeliveries.filter((delivery) => delivery.type === vehicleInfo?.deliveries[0].type)
            }
            deliveries.push(...waitingDeliveries);
            socket.emit('allDeliveries', deliveries)
        })
        socket.on('acceptDelivery', async(data) => {
            const { delivery_id, vehicle_id, driver_id } = data;
            const waitingDelivery = await Delivery.findById(delivery_id);
            if (waitingDelivery.status === 'waiting') {
                const updatedDelivery = await Delivery.findByIdAndUpdate(delivery_id, {status: 'accepted', driver: driver_id}, {new: true})
                const vehicle = await Vehicle.findById(vehicle_id);
                vehicle.deliveries.push(delivery_id);
                if (!vehicle.orders.includes(waitingDelivery.order)) {
                    vehicle.orders.push(waitingDelivery.order);
                }
                vehicle.save();
                // return res.json(data)
                socket.emit('updatedDelivery', updatedDelivery)
            }
        })
        socket.on('updateDeliveryStatus', async(data) => {
            const { delivery_id, status } = data;
            let updatedDelivery = await Delivery.findByIdAndUpdate(delivery_id, {status: status}, {new: true})
            socket.emit('updatedDelivery', updatedDelivery)
        })
        socket.on('deleteDelivery', async(data) => {
            const { delivery_id } = data;
            const { order_id } = data;
            if (delivery_id) {
                await Delivery.findByIdAndDelete(delivery_id)
                socket.emit('deleteDelivery', delivery_id);
            }
            else if (order_id) {
                const res = await Delivery.findOneAndDelete({order: order_id})
                io.emit('deleteDelivery', res._id.toString());
            }
        })
    });
}

export { 
    getDeliveryByStatus, 
    createDelivery, 
    getDeliveryHistory,
    updateDeliveryStatus,
    acceptDelivery,
    socketDelivery 
}