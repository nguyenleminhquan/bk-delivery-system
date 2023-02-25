import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { getDeliveryHistoryThunk, getOrderDeliveryThunk } from "./deliveryThunk";

const initialState = {
    deliveries: [],
    isLoading: false,
    error: null,
};

export const getDeliveryHistory = createAsyncThunk(
    'delivery/getDeliveryHistory',
    async(driverId, thunkAPI) => {
        return getDeliveryHistoryThunk(driverId, thunkAPI);
    }
)

export const getOrderDelivery = createAsyncThunk(
    'delivery/getOrderDelivery',
    async(delivery, thunkAPI) => {
        return getOrderDeliveryThunk(delivery, thunkAPI);
    }
)



const deliverySlice = createSlice({
    name: 'delivery',
    initialState,
    reducers: {
        clearAllDeliveriesState: (state) => initialState,
    },
    extraReducers: {
        [getDeliveryHistory.pending]: (state) => {
            state.isLoading = true;
        },
        [getDeliveryHistory.fulfilled]: (state, {payload}) => {
            state.deliveries = payload;
            state.isLoading = false;
            // toast.success('Create order successfully');
        },
        [getDeliveryHistory.rejected]: (state, {payload}) => {
            console.log(payload);
            state.isLoading = false;
            toast.error(payload);
        },
        [getOrderDelivery.pending]: (state) => {
            state.isLoading = true;
        },
        [getOrderDelivery.fulfilled]: (state, {payload}) => {
            console.log('payload', payload)
            state.deliveries = payload;
            state.isLoading = false;
            // toast.success('Create order successfully');
        },
        [getOrderDelivery.rejected]: (state, {payload}) => {
            console.log(payload);
            state.isLoading = false;
            toast.error(payload);
        },
    }
})

export const {
    clearAllDeliveriesState
} = deliverySlice.actions

export default deliverySlice.reducer;

  