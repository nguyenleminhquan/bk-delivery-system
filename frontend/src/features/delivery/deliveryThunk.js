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