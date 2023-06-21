import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { toast } from "react-toastify";
import { addStockThunk, deleteStockThunk, editStockThunk, getStocksThunk, importOrderToStockThunk } from "./stockThunk"

const initialState = {
    stocks: [],
    orders: [],
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

export const editStock = createAsyncThunk(
    'stock/editStock',
    async(payload, thunkAPI) => {
        return editStockThunk(payload, thunkAPI);
    }
)

export const importOrderToStock = createAsyncThunk(
    'stock/importOrderToStock', 
    async(payload, thunkAPI) => {
        return importOrderToStockThunk(payload, thunkAPI);
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
            state.stocks = [...state.stocks, payload];
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
            state.stocks = state.stocks.filter(stock => stock._id !== payload._id);
            toast.success('Xóa kho thành công.');
        },
        [deleteStock.rejected]: (state, {payload}) => {
            state.isLoading = false;
            toast.error(payload);
        },
        [editStock.pending]: state => {
            state.isLoading = true;
        },
        [editStock.fulfilled]: (state, {payload}) => {
            state.isLoading = false;
            const updated = state.stocks.map(stock => {
                if (stock._id === payload._id) {
                    return payload;
                } return stock;
            })
            state.stocks = [...updated];
            toast.success('Chỉnh sửa kho thành công.');
        },
        [editStock.rejected]: (state, {payload}) => {
            state.isLoading = false;
            toast.error(payload);
        },
        [importOrderToStock.pending]: state => {
            state.isLoading = true;
        },
        [importOrderToStock.rejected]: (state, {payload}) => {
            state.isLoading = false;
            toast.error(payload);
        },
        [importOrderToStock.fulfilled]: (state, {payload}) => {
            console.log(payload);
            state.isLoading = false;
        }
    }
})

export default stockSlice.reducer;
