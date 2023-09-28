import { checkForUnauthorizedResponse } from "services/axios";
import DeliveryService from "services/delivery.service";

export const getDeliveryHistoryThunk = async(deliveryId, thunkAPI) => {
    try {
        const res = await DeliveryService.getDeliveryHistory(deliveryId);
        return res.data
    } catch(error) {
        console.log(error);
        return checkForUnauthorizedResponse(error, thunkAPI);
    }
}

export const getOrderDeliveryThunk = async(delivery, thunkAPI) => {
    try {
        const res = await DeliveryService.getDeliveryByStatus(delivery)
        return res.data
    } catch(error) {
        console.log(error);
        return checkForUnauthorizedResponse(error, thunkAPI);
    }
}

export const acceptDeliveryThunk = async(delivery, thunkAPI) => {
    try {
        const res = await DeliveryService.acceptDelivery(delivery)
        return res.data
    } catch(error) {
        console.log(error);
        return checkForUnauthorizedResponse(error, thunkAPI);
    }
}

export const updateDeliveryStatusThunk = async(delivery, thunkAPI) => {
    try {
        const res = await DeliveryService.updateDeliveryStatus(delivery)
        return res.data
    } catch(error) {
        console.log(error);
        return checkForUnauthorizedResponse(error, thunkAPI);
    }
}

export const getAllDeliveryThunk = async(data, thunkAPI) => {
    try {
        const res = await DeliveryService.getAllDelivery(data);
        return res.data
    } catch(error) {
        console.log(error);
        return checkForUnauthorizedResponse(error, thunkAPI);
    }
}

export const getVehiclesThunk = async(thunkAPI) => {
    try {
        const res = await DeliveryService.getVehicles();
        return res.data;
    } catch(error) {
        return checkForUnauthorizedResponse(error, thunkAPI);
    }
}

export const addVehicleThunk = async(payload, thunkAPI) => {
    try {
        const res = await DeliveryService.addVehicle(payload);
        return res.data;
    } catch(error) {
        return checkForUnauthorizedResponse(error, thunkAPI);
    }
}

export const getVehicleByRegionThunk = async(region, thunkAPI) => {
    try {
        const res = await DeliveryService.getVehicleByRegion(region);
        return res.data;
    } catch(error) {
        return checkForUnauthorizedResponse(error, thunkAPI);
    }
}

export const getVehicleOrdersThunk = async(vehicle, thunkAPI) => {
    try {
        const res = await DeliveryService.getVehicleOrders(vehicle);
        return res.data;
    } catch(error) {
        return checkForUnauthorizedResponse(error, thunkAPI);
    }
}

export const getVehicleOrdersListsThunk = async(vehicle, thunkAPI) => {
    try {
        const res = await DeliveryService.getVehicleOrderLists(vehicle);
        return res.data;
    } catch(error) {
        return checkForUnauthorizedResponse(error, thunkAPI);
    }
}

export const deleteVehicleOrderThunk = async(vehicle, thunkAPI) => {
    try {
        const res = await DeliveryService.deleteVehicleOrder(vehicle);
        return res.data;
    } catch(error) {
        return checkForUnauthorizedResponse(error, thunkAPI);
    }
}

export const postVehicleOrdersThunk = async(vehicle, thunkAPI) => {
    try {
        const res = await DeliveryService.postVehicleOrders(vehicle);
        return res.data;
    } catch(error) {
        return checkForUnauthorizedResponse(error, thunkAPI);
    }
}

export const getVehicleByRouteThunk = async(param, thunkAPI) => {
    try {
        const res = await DeliveryService.getVehicleByRoute(param);
        return res.data;
    } catch(error) {
        return checkForUnauthorizedResponse(error, thunkAPI);
    }
}

export const exportOrderOnVehicleThunk = async(payload, thunkAPI) => {
    const { exportPayload, deliveryPayload, socket } = payload
    try {
        const res = await DeliveryService.exportOrderOnVehicle(exportPayload);
        const deliveries = [];
        console.log('data of export', res.data)
        res.data.dest_stocks.forEach((stock) => {
            stock.orders.forEach((order) => {
                const payload = {
                    ...deliveryPayload,
                    order_id: order,
                }
                deliveries.push(payload)
            })
        })
        socket.emit('newDeliveries', deliveries);
        return res.data;
    } catch(error) {
        return checkForUnauthorizedResponse(error, thunkAPI);
    }
}

export const getVehicleByIdThunk = async(param, thunkAPI) => {
    try {
        const res = await DeliveryService.getVehicleById(param);
        return res.data;
    } catch(error) {
        return checkForUnauthorizedResponse(error, thunkAPI);
    }
}

export const getVehiclesInOrderManagementThunk = async(param, thunkAPI) => {
    try {
        const res = await DeliveryService.getVehiclesInOrderManagement(param);
        return res.data;
    } catch(error) {
        return checkForUnauthorizedResponse(error, thunkAPI);
    }
}