import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { createOrderThunk, getOrderThunk } from "./orderThunk";

const initialState = {
    orders: [],
    newOrder: '',
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

export const createOrder = createAsyncThunk(
    'order/createOrder',
    async(order, thunkAPI) => {
        return createOrderThunk(order, thunkAPI)
    }
)

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        
    },
    extraReducers: {
        [createOrder.pending]: (state) => {
            state.isLoading = true;
        },
        [createOrder.fulfilled]: (state, {payload}) => {
            console.log(payload);
            state.orders = payload;
            state.newOrder = payload
            state.isLoading = false;
            toast.success('Create order successfully');
        },
        [createOrder.rejected]: (state, {payload}) => {
            console.log(payload);
            state.isLoading = false;
            toast.error(payload);
        }
    }
})

export default orderSlice.reducer;

  