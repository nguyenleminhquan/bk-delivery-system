import StockService from "services/stock.service"

export const getStocksThunk = async(thunkAPI) => {
    try {
        const res = await StockService.getStocks();
        return res.data;
    } catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
}
