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

const getVehicleByRegion = (region_id) => {
    return customFetch.get(`/vehicle/region/${region_id}`);
}

const getVehicleOrders = (vehicle_id) => {
    return customFetch.get(`/vehicle/${vehicle_id}/order`);
}

const postVehicleOrders = ({vehicle_id, list_orders}) => {
    return customFetch.post(`/vehicle/${vehicle_id}/order`, {list_orders});
}

const deleteVehicleOrder = ({order_id, vehicle_id}) => {
    return customFetch.delete(`/vehicle/order/${order_id}`, {data: {vehicle_id}});
}

const getVehicleAvailableOrder = (vehicle_id) => {
    return customFetch.get(`/vehicle/${vehicle_id}/avail-order`);
}

const getVehicleByRoute = ({from, to}) => {
    return customFetch.get(`/vehicle/search?from=${from}&to=${to}`);
}

const exportOrderOnVehicle = ({vehicle_id, stocker_id}) => {
    return customFetch.post(`/vehicle/${vehicle_id}/export-order`, { stocker_id });
}

const DeliveryService = {
    getDeliveryHistory,
    getDeliveryByStatus,
    updateDeliveryStatus,
    acceptDelivery,
    getVehicles,
    getVehicleByRegion,
    getVehicleOrders,
    deleteVehicleOrder,
    postVehicleOrders,
    getVehicleAvailableOrder,
    getVehicleByRoute,
    exportOrderOnVehicle,
}

export default DeliveryService