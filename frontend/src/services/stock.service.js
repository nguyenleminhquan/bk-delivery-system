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

const editStock = id => {
    return customFetch.patch(`/stock/${id}`);
}

const importOrderToStock = payload => {
    // Payload contains: {order_id: string, stock_id: string, stocker_id: string}
    return customFetch.post(`/stock/order`, payload);
}

const StockService = {
    getStocks,
    addStock,
    deleteStock,
    editStock,
    importOrderToStock,
}

export default StockService;