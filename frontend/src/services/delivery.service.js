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

const getAllDelivery = ({ vehicle_id, area_code, district_code, type }) => {
    return customFetch.get(`delivery/all-delivery?vehicle_id=${vehicle_id}&area_code=${area_code}&district_code=${district_code}&type=${type}`)
}

const getVehicles = () => {
    return customFetch.get('/vehicle');
}

const addVehicle = payload => {
    return customFetch.post('/vehicle', payload);
}

const getVehicleByRegion = (region_id) => {
    return customFetch.get(`/vehicle/region/${region_id}`);
}

const getVehicleOrders = ({vehicle_id, stock_id}) => {
    return customFetch.get(`/vehicle/${vehicle_id}/order?filter=stock&stock_id=${stock_id}`);
}

const getVehicleOrderLists = ({vehicle_id}) => {
    return customFetch.get(`/vehicle/${vehicle_id}/order`);
}

const postVehicleOrders = ({vehicle_id, list_orders, stock_id}) => {
    return customFetch.post(`/vehicle/${vehicle_id}/order`, {list_orders, stock_id});
}

const deleteVehicleOrder = ({order_id, vehicle_id, stock_id}) => {
    return customFetch.delete(`/vehicle/order/${order_id}`, {data: {vehicle_id, stock_id}});
}

const getVehicleByRoute = ({from, to}) => {
    return customFetch.get(`/vehicle/search?from=${from}&to=${to}`);
}

const exportOrderOnVehicle = ({vehicle_id, stocker_id}) => {
    return customFetch.post(`/vehicle/${vehicle_id}/export-order`, { stocker_id });
}

const getVehicleById = (vehicle_id) => {
    return customFetch.get(`/vehicle/${vehicle_id}`);
}

const DeliveryService = {
    getDeliveryHistory,
    getDeliveryByStatus,
    updateDeliveryStatus,
    acceptDelivery,
    getAllDelivery,
    getVehicles,
    addVehicle,
    getVehicleByRegion,
    getVehicleOrders,
    getVehicleOrderLists,
    deleteVehicleOrder,
    postVehicleOrders,
    getVehicleByRoute,
    exportOrderOnVehicle,
    getVehicleById
}

export default DeliveryService