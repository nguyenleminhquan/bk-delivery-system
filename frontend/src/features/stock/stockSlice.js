import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { toast } from "react-toastify";
import { addStockThunk, deleteStockThunk, getStocksThunk } from "./stockThunk"

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

export const addStock = createAsyncThunk(
    'stock/addStock',
    async(payload, thunkAPI) => {
        return addStockThunk(payload, thunkAPI);
    }
)

export const deleteStock = createAsyncThunk(
    'stock/deleteStock',
    async(payload, thunkAPI) => {
        return deleteStockThunk(payload, thunkAPI);
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
        },
        [addStock.pending]: state => {
            state.isLoading = true;          
        },
        [addStock.fulfilled]: (state, {payload}) => {
            state.isLoading = false;
            toast.success('Tạo kho mới thành công.');
        },
        [addStock.rejected]: (state, {payload}) => {
            state.isLoading = false;
            toast.error(payload);
        },
        [deleteStock.pending]: state => {
            state.isLoading = true;
        },
        [deleteStock.fulfilled]: (state, {payload}) => {
            state.isLoading = false;
            toast.success('Xóa kho thành công.');
        },
        [deleteStock.rejected]: (state, {payload}) => {
            state.isLoading = false;
            toast.error(payload);
        }
    }
})

export default stockSlice.reducer;
