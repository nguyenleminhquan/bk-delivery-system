import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { acceptDeliveryThunk, addVehicleThunk, deleteVehicleOrderThunk, exportOrderOnVehicleThunk, getAllDeliveryThunk, getDeliveryHistoryThunk, getOrderDeliveryThunk, getVehicleByIdThunk, getVehicleByRegionThunk, getVehicleByRouteThunk, getVehicleOrdersListsThunk, getVehicleOrdersThunk, getVehiclesInOrderManagementThunk, getVehiclesThunk, postVehicleOrdersThunk, updateDeliveryStatusThunk } from "./deliveryThunk";

const initialState = {
    deliveries: [],
    vehicle: {},
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

export const getAllDelivery = createAsyncThunk(
    'delivery/getAllDelivery',
    async(delivery, thunkAPI) => {
        return getAllDeliveryThunk(delivery, thunkAPI);
    }
)

export const getVehicles = createAsyncThunk(
    'delivery/getVehicles',
    async(thunkAPI) => {
        return getVehiclesThunk(thunkAPI);
    }
)

export const addVehicle = createAsyncThunk(
    'delivery/addVehicle',
    async(payload, thunkAPI) => {
        return addVehicleThunk(payload, thunkAPI);
    }
)

export const getVehicleOrders = createAsyncThunk(
    'delivery/getVehicleOrders',
    async(vehicle, thunkAPI) => {
        return getVehicleOrdersThunk(vehicle, thunkAPI);
    }
)

export const getVehicleOrderLists = createAsyncThunk(
    'delivery/getVehicleOrderLists',
    async(vehicle, thunkAPI) => {
        return getVehicleOrdersListsThunk(vehicle, thunkAPI);
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
        return postVehicleOrdersThunk(vehicle, thunkAPI);
    }
)

export const getVehicleByRoute = createAsyncThunk(
    'delivery/getVehicleByRoute',
    async(param, thunkAPI) => {
        return getVehicleByRouteThunk(param, thunkAPI);
    }
)

export const exportOrderOnVehicle = createAsyncThunk(
    'delivery/exportOrderOnVehicle',
    async(payload, thunkAPI) => {
        return exportOrderOnVehicleThunk(payload, thunkAPI);
    }
)

export const getVehicleById = createAsyncThunk(
    'delivery/getVehicleById',
    async(payload, thunkAPI) => {
        return getVehicleByIdThunk(payload, thunkAPI);
    }
)

export const getVehiclesInOrderManagement = createAsyncThunk(
    'delivery/getVehiclesInOrderManagement',
    async(payload, thunkAPI) => {
        return getVehiclesInOrderManagementThunk(payload, thunkAPI);
    }
)


const deliverySlice = createSlice({
    name: 'delivery',
    initialState,
    reducers: {
        clearAllDeliveriesState: (state) => initialState,
        clearVehicleOrders: state => {
            state.vehicleOrders = [];
        }
    },
    extraReducers: {
        [getDeliveryHistory.pending]: (state) => {
            state.isLoading = true;
        },
        [getDeliveryHistory.fulfilled]: (state, {payload}) => {
            state.deliveries = payload;
            state.isLoading = false;
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
        },
        [getOrderDelivery.rejected]: (state, {payload}) => {
            console.log(payload);
            state.isLoading = false;
            toast.error(payload);
        },
        [acceptDelivery.fulfilled]: (state, { payload }) => {
            state.toggleAction = !state.toggleAction;
            toast.success('Đơn hàng đã được chấp nhận!')
        },
        [acceptDelivery.rejected]: (state, { payload }) => {
            toast.error(payload)
        },
        [updateDeliveryStatus.fulfilled]: (state, { payload }) => {
            state.toggleAction = !state.toggleAction;
            toast.success('Đã cập nhật trạng thái!')
        },
        [updateDeliveryStatus.rejected]: (state, { payload }) => {
            toast.error(payload)
        },
        [getDeliveryHistory.pending]: (state) => {
            state.isLoading = true;
        },
        [getDeliveryHistory.fulfilled]: (state, { payload }) => {
            state.deliveries = payload;
            state.isLoading = false;
        },
        [getDeliveryHistory.rejected]: (state, { payload }) => {
            console.log(payload);
            state.isLoading = false;
            toast.error(payload);
        },
        [getAllDelivery.pending]: (state) => {
            state.isLoading = true;
        },
        [getAllDelivery.fulfilled]: (state, { payload }) => {
            state.deliveries = payload;
            state.isLoading = false;
        },
        [getAllDelivery.rejected]: (state, { payload }) => {
            console.log(payload);
            state.isLoading = false;
            toast.error(payload);
        },
        [getVehicles.fulfilled]: (state, { payload }) => {
            state.vehicles = payload;
            state.isLoading = false;
        },
        [getVehicles.rejected]: (state, { payload }) => {
            toast.error(payload);
            state.isLoading = false;
        },
        [addVehicle.pending]: state => {
            state.isLoading = true;
        },
        [addVehicle.rejected]: (state, { payload }) => {
            state.isLoading = false;
            toast.error(payload);
        },
        [addVehicle.fulfilled]: (state, { payload }) => {
            state.isLoading = false;
            state.vehicles = [...state.vehicles, payload];
            toast.success('Thêm xe thành công!');
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
            state.isLoading = false;
            state.vehicleOrders = payload;
        },
        [getVehicleOrders.rejected]: (state, { payload }) => {
            state.isLoading = false;
            toast.error(payload);
        },
        [getVehicleOrderLists.pending]: state => {
            state.isLoading = true;
        },
        [getVehicleOrderLists.fulfilled]: (state, { payload }) => {
            state.isLoading = false;
            state.vehicleOrders = payload;
        },
        [getVehicleOrderLists.rejected]: (state, { payload }) => {
            state.isLoading = false;
            toast.error(payload);
        },
        [deleteVehicleOrder.pending]: state => {
            state.isLoading = true;
        },
        [deleteVehicleOrder.fulfilled]: (state, { payload }) => {
            state.isLoading = false;
            const ordersUpdated = state.vehicleOrders.filter(order => payload.orders.includes(order._id));
            state.vehicleOrders = ordersUpdated;
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
            state.orders = state.orders.filter(order => !payload.orders.find(_order => _order?._id === order?._id));
            const activeVehicleIndex = state.vehicles.findIndex(vehicle => vehicle?._id === payload?._id);
            state.vehicles[activeVehicleIndex] = payload;
            toast.success('Thêm đơn hàng thành công.');
        },
        [getVehicleByRoute.pending]: state => {
            state.isLoading = true;
        },
        [getVehicleByRoute.rejected]: (state, {payload}) => {
            state.isLoading = false;
            toast.error(payload);
        },
        [getVehicleByRoute.fulfilled]: (state, {payload}) => {
            console.log(payload);
            state.isLoading = false;
            state.vehicles = payload;
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
        },
        [getVehicleById.pending]: state => {
            state.isLoading = true;
        }, 
        [getVehicleById.fulfilled]: (state, {payload}) => {
            state.isLoading = false;
            state.vehicle = payload
        },
        [getVehicleById.rejected]: (state, {payload}) => {
            state.isLoading = false;
            toast.error(payload);
        },
        [getVehiclesInOrderManagement.pending]: state => {
            state.isLoading = true;
        }, 
        [getVehiclesInOrderManagement.fulfilled]: (state, {payload}) => {
            state.isLoading = false;
            state.vehicles = payload
        },
        [getVehiclesInOrderManagement.rejected]: (state, {payload}) => {
            state.isLoading = false;
            toast.error(payload);
        }
    }
})

export const {
    clearAllDeliveriesState,
    clearVehicleOrders
} = deliverySlice.actions

export default deliverySlice.reducer;

  