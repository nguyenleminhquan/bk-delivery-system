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
    const { importPayload, socket } = payload;
    try {
        const res = await StockService.importOrderToStock(importPayload);
        importPayload.order_ids.forEach((orderId) => {
			socket.emit('removeDeliveryFromVehicle', {
				order_id: orderId,
				vehicle_id: importPayload.vehicle_id
			})
			socket.emit('updateOrderStatus', {
				order_id: orderId,
				status: 'import',
				date: new Date()
			})
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
