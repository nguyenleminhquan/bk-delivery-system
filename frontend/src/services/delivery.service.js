import customFetch from "./axios"

const getDeliveryHistory = (driverId) => {
    return customFetch.get(`/delivery/history/${driverId}`)
}

const DeliveryService = {
    getDeliveryHistory
}

export default DeliveryService