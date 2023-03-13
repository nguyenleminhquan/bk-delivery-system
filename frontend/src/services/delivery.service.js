import customFetch from "./axios"

const getDeliveryHistory = (driverId) => {
    return customFetch.get(`/delivery/history/${driverId}`)
}

const getDeliveryByStatus = ({ status, area_code, type }) => {
    return customFetch.get(`/delivery?status=${status}&area_code=${area_code}&type=${type}`)
}

const acceptDelivery = ({ driver_id, delivery_id }) => {
    return customFetch.patch(
        `/delivery/${delivery_id}/accept-delivery`,
        {
            driver_id: driver_id
        }
    )
}

const updateDeliveryStatus = ({ delivery_id, status }) => {
    return customFetch.patch(
        `/delivery/${delivery_id}/update-status`,
        {
            status: status
        }
    )
}

const getVehicles = () => {
    return customFetch.get('/vehicle');
}

const DeliveryService = {
    getDeliveryHistory,
    getDeliveryByStatus,
    updateDeliveryStatus,
    acceptDelivery,
    getVehicles
}

export default DeliveryService