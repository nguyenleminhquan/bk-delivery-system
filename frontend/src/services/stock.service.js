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

const getStockOrders = stock_id => {
    return customFetch.get(`/stock/${stock_id}/order`);
}

const importOrderToStock = payload => {
    // Payload contains: {order_ids: string, stock_id: string, stocker_id: string, vehicle_id}
    return customFetch.post(`/stock/order`, payload);
}

const getImportHistory = (stock_id) => {
    return customFetch.get(`/stock/${stock_id}/import-history`)
}

const getExportHistory = (stock_id) => {
    return customFetch.get(`/stock/${stock_id}/export-history`)
}

const getStockVehicles = stock_id => {
    return customFetch.get(`/stock/${stock_id}/vehicles`);
}

const getAvailableVehicleOrders = ({stock_id, vehicle_id}) => {
    return customFetch.get(`/stock/${stock_id}/vehicle/${vehicle_id}/avail-orders`);
}

const StockService = {
    getStocks,
    addStock,
    deleteStock,
    editStock,
    importOrderToStock,
    getImportHistory,
    getExportHistory,
    getStockOrders,
    getStockVehicles,
    getAvailableVehicleOrders,
}

export default StockService;