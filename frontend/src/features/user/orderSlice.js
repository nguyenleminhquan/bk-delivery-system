import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { createOrderThunk, getOrderByIdThunk, getOrdersByUserIdThunk, getOrderThunk } from "./orderThunk";

const initialState = {
    orders: [],
    newOrder: '',
    order: {},
    total: 0,
    isLoading: false,
    error: null,
};

export const getOrders = createAsyncThunk(
    'order/getOrders',
    async(thunkAPI) => {
        return getOrderThunk(thunkAPI);
    }
)

export const getOrderById = createAsyncThunk(
    'order/getOrderById',
    async(orderId, thunkAPI) => {
        return getOrderByIdThunk(orderId, thunkAPI);
    }
)

export const getOrdersByUserId = createAsyncThunk(
    'order/getOrdersByUserId',
    async(payload, thunkAPI) => {
        return getOrdersByUserIdThunk(payload, thunkAPI);
    }
)

export const createOrder = createAsyncThunk(
    'order/createOrder',
    async(payload, thunkAPI) => {
        return createOrderThunk(payload, thunkAPI)
    }
)

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        resetOrder: state => {
            state.order = {}
        },
    },
    extraReducers: {
        [createOrder.pending]: (state) => {
            state.isLoading = true;
        },
        [createOrder.fulfilled]: (state, {payload}) => {
            state.isLoading = false;
            state.newOrder = payload
            toast.success('Create order successfully');
        },
        [createOrder.rejected]: (state, {payload}) => {
            console.log(payload);
            state.isLoading = false;
            toast.error(payload);
        },
        [getOrdersByUserId.pending]: (state) => {
            state.isLoading = true;
        },
        [getOrdersByUserId.fulfilled]: (state, {payload}) => {
            state.isLoading = false;
            state.orders = payload
        },
        [getOrdersByUserId.rejected]: (state) => {
            state.isLoading = false;
        },
        [getOrderById.pending]: state => {
            state.isLoading = true;
        },
        [getOrderById.rejected]: (state, {payload}) => {
            state.isLoading = false;
            toast.error(payload);
        },
        [getOrderById.fulfilled]: (state, {payload}) => {
            state.isLoading = false;
            state.order = {...payload[0]}
        }
    }
})

export const { resetOrder } = orderSlice.actions;
export default orderSlice.reducer;
