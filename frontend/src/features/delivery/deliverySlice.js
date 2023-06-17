import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { acceptDeliveryThunk, deleteVehicleOrderThunk, exportOrderOnVehicleThunk, getDeliveryHistoryThunk, getOrderDeliveryThunk, getVehicleAvailableOrderThunk, getVehicleByRegionThunk, getVehicleOrdersThunk, getVehiclesThunk, updateDeliveryStatusThunk } from "./deliveryThunk";

const initialState = {
    deliveries: [],
    vehicles: [],
    vehicleOrders: [],
    orders: [],
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

export const getVehicleOrders = createAsyncThunk(
    'delivery/getVehicleOrders',
    async(vehicle, thunkAPI) => {
        return getVehicleOrdersThunk(vehicle, thunkAPI);
    }
)

export const getVehicleByRegion = createAsyncThunk(
    'delivery/getVehicleByRegion',
    async(region, thunkAPI) => {
        return getVehicleByRegionThunk(region, thunkAPI);
    }
)

export const deleteVehicleOrder = createAsyncThunk(
    'delivery/deleteVehicleOrder',
    async(vehicle, thunkAPI) => {
        return deleteVehicleOrderThunk(vehicle, thunkAPI);
    }
)

export const postVehicleOrders = createAsyncThunk(
    'delivery/postVehicleOrders',
    async(vehicle, thunkAPI) => {
        return postVehicleOrders(vehicle, thunkAPI);
    }
)

export const getVehicleAvailableOrder = createAsyncThunk(
    'delivery/getVehicleAvailableOrder',
    async(vehicle, thunkAPI) => {
        return getVehicleAvailableOrderThunk(vehicle, thunkAPI);
    }
)

export const exportOrderOnVehicle = createAsyncThunk(
    'delivery/exportOrderOnVehicle',
    async(payload, thunkAPI) => {
        return exportOrderOnVehicleThunk(payload, thunkAPI);
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
            state.vehicles = payload;
            state.isLoading = false;
        },
        [getVehicles.rejected]: (state, { payload }) => {
            toast.error(payload);
            state.isLoading = false;
        },
        [getVehicleByRegion.fulfilled]: (state, { payload }) => {
            state.vehicles = payload;
            state.isLoading = false;
        },
        [getVehicleByRegion.pending]: (state) => {
            state.isLoading = true;
        },
        [getVehicleByRegion.rejected]: (state, {payload }) => {
            toast.error(payload);
            state.isLoading = false;
        },
        [getVehicleOrders.fulfilled]: (state, { payload }) => {
            state.vehicleOrders = payload;
            state.isLoading = false;
        },
        [getVehicleOrders.rejected]: (state, { payload }) => {
            toast.error(payload);
            state.isLoading = false;
        },
        [deleteVehicleOrder.pending]: state => {
            state.isLoading = true;
        },
        [deleteVehicleOrder.fulfilled]: (state, { payload }) => {
            state.isLoading = false;
            const updatedOrders = state.vehicleOrders.filter(order => order._id !== payload._id);
            state.vehicleOrders = updatedOrders;
            toast.success('Xóa đơn hàng thành công');
        },
        [deleteVehicleOrder.rejected]: (state, { payload }) => {
            state.isLoading = false;
            toast.error(payload);
        },
        [postVehicleOrders.pending]: state => {
            state.isLoading = true;
        },
        [postVehicleOrders.rejected]: (state, {payload}) => {
            state.isLoading = false;
            toast.error(payload);
        },
        [postVehicleOrders.fulfilled]: (state, {payload}) => {
            state.isLoading = false;
            console.log(payload);
            // state.vehicleOrders = [...state.vehicleOrders, payload];
            toast.success('Thêm đơn hàng thành công.');
        },
        [getVehicleAvailableOrder.pending]: state => {
            state.isLoading = true;
        },
        [getVehicleAvailableOrder.rejected]: (state, {payload}) => {
            state.isLoading = false;
            toast.error(payload);
        },
        [getVehicleAvailableOrder.fulfilled]: (state, {payload}) => {
            state.isLoading = false;
            state.orders = payload;
        },
        [exportOrderOnVehicle.pending]: state => {
            state.isLoading = true;
        }, 
        [exportOrderOnVehicle.rejected]: (state, {payload}) => {
            state.isLoading = false;
            toast.error(payload);
        },
        [exportOrderOnVehicle.fulfilled]: (state, {payload}) => {
            state.isLoading = false;
            toast.success('Xuất đơn hàng lên xe tải thành công');
            // Save order data...
        }
    }
})

export const {
    clearAllDeliveriesState
} = deliverySlice.actions

export default deliverySlice.reducer;

  