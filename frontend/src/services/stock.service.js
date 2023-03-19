import customFetch from "./axios";

const getStocks = () => {
    return customFetch.get('/stock');
}

const addStock = (payload) => {
    return customFetch.post('/stock', payload);
}

const deleteStock = id => {
    return customFetch.delete(`/stock/${id}`);
}

const editStock = ({id, address}) => {
    return customFetch.patch(`/stock/${id}`, {address});
}

const StockService = {
    getStocks,
    addStock,
    deleteStock,
    editStock
}

export default StockService;