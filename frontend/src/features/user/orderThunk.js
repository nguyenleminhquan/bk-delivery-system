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

export const createOrderThunk = async(order, thunkAPI) => {
    try {
        const res = await OrderService.create(order);
        console.log(res?.data);
        // return res.data
    } catch(error) {
        console.log(error);
        return thunkAPI.rejectWithValue(error.response.data.msg);

    }
}