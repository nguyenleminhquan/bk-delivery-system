import { checkForUnauthorizedResponse } from "services/axios";
import OrderService from "services/order.service";

export const getOrderThunk = async(thunkAPI) => {
    try {
        const res = await OrderService.get();
        // console.log(res?.data);
        // return res.data;
    } catch(error) {
        console.log(error);
        return checkForUnauthorizedResponse(error, thunkAPI)
    }
}

export const getOrderByIdThunk = async(orderId, thunkAPI) => {
    try {
        const res = await OrderService.getOrderById(orderId);
        return res.data;
    } catch(error) {
        return checkForUnauthorizedResponse(error, thunkAPI)
    }
}

export const getOrdersByUserIdThunk = async(userId, thunkAPI) => {
    try {
        const res = await OrderService.getOrdersByUserId(userId);
        // console.log(res?.data);
        return res.data;
    } catch(error) {
        console.log(error);
        return checkForUnauthorizedResponse(error, thunkAPI)
    }
}

export const createOrderThunk = async(payload, thunkAPI) => {
    const { orderPayload, deliveryPayload, socket } = payload
    try {
        const res = await OrderService.create(orderPayload);
        deliveryPayload.order_id = res.data._id
        socket.emit('newDelivery', deliveryPayload);
        socket.emit('updateOrderStatus', {
            order_id: res.data._id,
            status: 'waiting',
            date: new Date()
          })
        return res.data
    } catch(error) {
        console.log(error);
        return checkForUnauthorizedResponse(error, thunkAPI)
    }
}