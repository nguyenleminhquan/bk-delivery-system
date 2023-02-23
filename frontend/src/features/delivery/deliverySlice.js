import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { getDeliveryHistoryThunk } from "./deliveryThunk";

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

const deliverySlice = createSlice({
    name: 'delivery',
    initialState,
    reducers: {

    },
    extraReducers: {
        [getDeliveryHistory.pending]: (state) => {
            state.isLoading = true;
        },
        [getDeliveryHistory.fulfilled]: (state, {payload}) => {
            // console.log(payload);
            state.deliveries = payload;
            state.isLoading = false;
            // toast.success('Create order successfully');
        },
        [getDeliveryHistory.rejected]: (state, {payload}) => {
            console.log(payload);
            state.isLoading = false;
            toast.error(payload);
        }
    }
})

export default deliverySlice.reducer;

  