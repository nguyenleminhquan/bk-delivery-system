import customFetch from "./axios";

const getStocks = () => {
    return customFetch.get('/stock');
}

const addStock = (payload) => {
    return customFetch.post('/stock', payload);
}

const StockService = {
    getStocks,
    addStock,
}

export default StockService;