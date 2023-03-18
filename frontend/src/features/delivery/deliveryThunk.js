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

export const getVehiclesThunk = async(thunkAPI) => {
    try {
        const res = await DeliveryService.getVehicles();
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

export const getVehicleAvailableOrderThunk = async(vehicle, thunkAPI) => {
    try {
        const res = await DeliveryService.getVehicleAvailableOrder(vehicle);
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
    try {
        const res = await DeliveryService.exportOrderOnVehicle(payload);
        return res.data;
    } catch(error) {
        return checkForUnauthorizedResponse(error, thunkAPI);
    }
}
