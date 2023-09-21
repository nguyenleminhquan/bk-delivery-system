import createError from 'http-errors'
import Delivery from '../models/Delivery.js';
import Stock from '../models/Stock.js';
import Vehicle from '../models/Vehicle.js';
import Order from '../models/Order.js';
import { calculateDistance, convertAddressToCoordinates, getAreaCodeAndDistrictCodeFromString } from '../utils/order-utils.js';

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
        .find({ driver: id, status: 'success' })
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
            return next(createError(400, "Đơn giao hàng đã được chấp nhận bởi tài xế khác!"))
        }
    } catch (err) {
        console.log(err)
        return next(createError(400))
    }
}

const getAllDelivery = async (req, res, next) => {
    try {
        let deliveries = [];
        // get deliveries in vehicle
        const { vehicle_id, area_code, district_code, type } = req.query;
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
        let waitingDeliveries = []
        if (type === 'inter') {
            waitingDeliveries = await Delivery
            .find({ status: 'waiting', area_code: area_code, type: 'inter' })
            .populate({
                path: 'order',
                populate: {
                    path: 'items',
                }
            })
        } else {
            waitingDeliveries = await Delivery
            .find({ status: 'waiting', area_code: area_code, district_code: district_code, type: {$regex: 'inner'} })
            .populate({
                path: 'order',
                populate: {
                    path: 'items',
                }
            })
        }
        // category into delivery types
        if (vehicleInfo?.deliveries.length > 0) {
            waitingDeliveries = waitingDeliveries.filter((delivery) => delivery.type === vehicleInfo?.deliveries[0].type)
        }
        // remove deliveries that belongs to other vehicle
        waitingDeliveries = waitingDeliveries.filter((delivery) => !delivery.vehicle_id || delivery.vehicle_id.toString() === vehicle_id)
        deliveries.push(...waitingDeliveries);
        return res.json(deliveries);
    } catch(err) {
        console.log(err)
        return next(createError(400))
    }
    
}

const findNearestArea = async (area_code, address) => {
    try {
        const stocks = await Stock.find({area_code: area_code});
        if (stocks.length === 0) return next(createError(400, 'Không thể tìm thấy khu vực gần nhất!'))
        let parseAddress = address.split(", ")
        let length_parseAddress = parseAddress.length
        let areaAddress = parseAddress[length_parseAddress - 1]
        let districtAddress = parseAddress[length_parseAddress - 2]
        const latlonOfAddress = await convertAddressToCoordinates(districtAddress + ', ' + areaAddress);
        let nearestStock;
        let minDistance = 999999;
        for (let stock of stocks) {
            const distance = await calculateDistance(`${latlonOfAddress.lat},${latlonOfAddress.lon}`, `${stock.lat},${stock.lon}`, 'driving');
            if (distance < minDistance) {
                minDistance = distance;
                nearestStock = stock;
            }
        }
        console.log('nearestStock', nearestStock)
        return nearestStock
    } catch(err) {
        console.log(err)
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
                let { status, order_id, driver_id, type, from, to, area_code, district_code, from_code, to_code, vehicle_id } = data;
                if (type === 'inner_sender') {
                    let area = await findNearestArea(data.area_code, from.split('&')[1]);
                    area_code = area.area_code;
                    district_code = area.district_code;
                    to = area.name + '&' + area.address;
                } else if (type === 'inter') {
                    const stock = await Stock.findOne({area_code: area_code, district_code: district_code});
                    from = stock.name + '&' + stock.address;
                    let area = await findNearestArea(getAreaCodeAndDistrictCodeFromString(to)[0], to.split('&')[1]);
                    to = area.name + '&' + area.address
                } else if (type === 'inner_receiver') {
                    const stock = await Stock.findOne({area_code: area_code, district_code: district_code});
                    from = stock.name + '&' + stock.address;
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
                    to_code: to_code,
                    vehicle_id: vehicle_id
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
        socket.on('acceptDelivery', async(data) => {
            const { delivery_id, vehicle_id, driver_id } = data;
            const waitingDelivery = await Delivery.findById(delivery_id);
            if (waitingDelivery.status === 'waiting') {
                const updatedDelivery = await Delivery.findByIdAndUpdate(delivery_id, {status: 'accepted', driver: driver_id}, {new: true}).populate('order');
                const vehicle = await Vehicle.findById(vehicle_id);
                vehicle.deliveries.push(delivery_id);
                if (!vehicle.orders.includes(updatedDelivery.order._id)) {
                    vehicle.orders.push(updatedDelivery.order._id);
                    vehicle.current_weight += updatedDelivery.order.weight;
                }
                if (updatedDelivery.type === 'inter') {
                    let area = await findNearestArea(getAreaCodeAndDistrictCodeFromString(updatedDelivery.to)[0], updatedDelivery.to.split('&')[1]);
                    vehicle.visitedStocks.push(area._id)
                }
                await vehicle.save();
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
        socket.on('removeDeliveryFromVehicle', async(data) => {
            let { delivery_id, vehicle_id, order_id } = data;
            if (order_id) {
                const res = await Delivery.findOne({order: order_id});
                delivery_id = res._id.toString();
            }
            const updatedDelivery = await Delivery.findByIdAndUpdate(delivery_id, {status: 'success'}, {new: true}).populate('order');
            const vehicle = await Vehicle.findById(vehicle_id);
            vehicle.deliveries = vehicle.deliveries.filter((delivery) => delivery.toString() !== delivery_id);
            vehicle.current_weight -= updatedDelivery.order.weight;
            await vehicle.save();
            io.emit('updatedDelivery', updatedDelivery)
        })
    });
}

export { 
    getDeliveryByStatus, 
    createDelivery, 
    getDeliveryHistory,
    updateDeliveryStatus,
    acceptDelivery,
    getAllDelivery,
    socketDelivery 
}
