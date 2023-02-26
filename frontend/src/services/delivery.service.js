import customFetch from "./axios"

const getDeliveryHistory = (driverId) => {
    return customFetch.get(`/delivery/history/${driverId}`)
}

const getDeliveryByStatus = ({ status, area_code, type }) => {
    return customFetch.get(`/delivery?status=${status}&area_code=${area_code}&type=${type}`)
}

const DeliveryService = {
    getDeliveryHistory,
    getDeliveryByStatus
}

export default DeliveryService