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

export const editStockThunk = async(payload, thunkAPI) => {
    try {
        const res = await StockService.editStock(payload);
        return res.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
}

export const getStockOrdersThunk = async(payload, thunkAPI) => {
    try {
        const res = await StockService.getStockOrders(payload);
        return res.data;
    } catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
}

export const importOrderToStockThunk = async(payload, thunkAPI) => {
    const { importPayload, socket, vehicleOrders } = payload;
    try {
        const res = await StockService.importOrderToStock(importPayload);
        vehicleOrders.forEach((order) => {
			socket.emit('removeDeliveryFromVehicle', {
				order_id: order._id,
				vehicle_id: importPayload.vehicle_id
			});
            if (order.status === 'arrived_send_stock') {
                socket.emit('updateOrderStatus', {
                    order_id: order._id,
                    status: 'import',
                    date: new Date()
                })
            } else {
                socket.emit('updateOrderStatus', {
                    order_id: order._id,
                    status: 'imported_dest_stock',
                    date: new Date()
                })
            }
		})
        return res.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
}

export const getImportHistoryThunk = async(payload, thunkAPI) => {
    try {
        const res = await StockService.getImportHistory(payload);
        return res.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
}

export const getExportHistoryThunk = async(payload, thunkAPI) => {
    try {
        const res = await StockService.getExportHistory(payload);
        return res.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
}

export const getStockVehiclesThunk = async(payload, thunkAPI) => {
    try {
        const res = await StockService.getStockVehicles(payload);
        return res.data;
    } catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
}

export const getAvailableVehicleOrdersThunk = async(payload, thunkAPI) => {
    try {
        const res = await StockService.getAvailableVehicleOrders(payload);
        return res.data;
    } catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
}
