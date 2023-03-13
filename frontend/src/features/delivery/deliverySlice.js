import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { acceptDeliveryThunk, getDeliveryHistoryThunk, getOrderDeliveryThunk, getVehiclesThunk, updateDeliveryStatusThunk } from "./deliveryThunk";

const initialState = {
    deliveries: [],
    vehicles: [],
    toggleAction: true,
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

export const acceptDelivery = createAsyncThunk(
    'delivery/acceptDelivery',
    async(delivery, thunkAPI) => {
        return acceptDeliveryThunk(delivery, thunkAPI);
    }
)

export const updateDeliveryStatus = createAsyncThunk(
    'delivery/updateDeliveryStatus',
    async(delivery, thunkAPI) => {
        return updateDeliveryStatusThunk(delivery, thunkAPI);
    }
)

export const getVehicles = createAsyncThunk(
    'delivery/getVehicles',
    async(thunkAPI) => {
        return getVehiclesThunk(thunkAPI);
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
        [acceptDelivery.fulfilled]: (state, { payload }) => {
            state.toggleAction = !state.toggleAction;
            toast.success('Order accepted!')
        },
        [acceptDelivery.rejected]: (state, { payload }) => {
            toast.error(payload)
        },
        [updateDeliveryStatus.fulfilled]: (state, { payload }) => {
            state.toggleAction = !state.toggleAction;
            toast.success('Status updated!')
        },
        [updateDeliveryStatus.rejected]: (state, { payload }) => {
            toast.error(payload)
        },
        [getVehicles.fulfilled]: (state, { payload }) => {
            console.log(payload);
            state.vehicles = payload;
            state.isLoading = false;
        },
        [getVehicles.rejected]: (state, { payload }) => {
            toast.error(payload);
            state.isLoading = false;
        }
    }
})

export const {
    clearAllDeliveriesState
} = deliverySlice.actions

export default deliverySlice.reducer;

  