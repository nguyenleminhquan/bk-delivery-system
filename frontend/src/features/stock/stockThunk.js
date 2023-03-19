import StockService from "services/stock.service"

export const getStocksThunk = async(thunkAPI) => {
    try {
        const res = await StockService.getStocks();
        return res.data;
    } catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
}

export const addStockThunk = async(payload, thunkAPI) => {
    try {
        const res = await StockService.addStock(payload);
        return res.data;
    } catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
}

export const deleteStockThunk = async(payload, thunkAPI) => {
    try {
        const res = await StockService.deleteStock(payload);
        return res.data;
    } catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
}
