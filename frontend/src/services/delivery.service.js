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

const getVehicleOrders = (vehicle_id) => {
    return customFetch.get(`/vehicle/${vehicle_id}/order`);
}

const postVehicleOrders = ({vehicle_id, order_ids}) => {
    return customFetch.post(`/vehicle/${vehicle_id}/order`, order_ids);
}

const deleteVehicleOrder = ({order_id, vehicle_id}) => {
    return customFetch.delete(`/vehicle/order/${order_id}`, {data: {vehicle_id}});
}

const DeliveryService = {
    getDeliveryHistory,
    getDeliveryByStatus,
    updateDeliveryStatus,
    acceptDelivery,
    getVehicles,
    getVehicleOrders,
    deleteVehicleOrder,
    postVehicleOrders
}

export default DeliveryService