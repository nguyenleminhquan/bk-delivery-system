import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { toast } from "react-toastify";
import { getStocksThunk } from "./stockThunk"

const initialState = {
    stocks: [],
    isLoading: false,
}

export const getStocks = createAsyncThunk(
    'stock/getStocks',
    async(thunkAPI) => {
        return getStocksThunk(thunkAPI);
    }
)

const stockSlice = createSlice({
    name: 'stock',
    initialState,
    reducers: {

    },
    extraReducers: {
        [getStocks.pending]: state => {
            state.isLoading = true;
        },
        [getStocks.fulfilled]: (state, {payload}) => {
            state.isLoading = false;
            state.stocks = payload;
        },
        [getStocks.rejected]: (state, {payload}) => {
            state.isLoading = false;
            toast.error(payload);
        }
    }
})

export default stockSlice.reducer;
