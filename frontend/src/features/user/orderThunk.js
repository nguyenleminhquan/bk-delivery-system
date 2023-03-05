import OrderService from "services/order.service";

export const getOrderThunk = async(thunkAPI) => {
    try {
        const res = await OrderService.get();
        // console.log(res?.data);
        // return res.data;
    } catch(error) {
        console.log(error);
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
}

export const getOrdersByUserIdThunk = async(userId, thunkAPI) => {
    try {
        const res = await OrderService.getOrdersByUserId(userId);
        // console.log(res?.data);
        return res.data;
    } catch(error) {
        console.log(error);
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
}

export const createOrderThunk = async(payload, thunkAPI) => {
    const { orderPayload, deliveryPayload, socket } = payload
    try {
        const res = await OrderService.create(orderPayload);
        deliveryPayload.order_id = res.data._id
        socket.emit('newDelivery', deliveryPayload);
        return res.data
    } catch(error) {
        console.log(error);
        return thunkAPI.rejectWithValue(error.response.data.msg);

    }
}