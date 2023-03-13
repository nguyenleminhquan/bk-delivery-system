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