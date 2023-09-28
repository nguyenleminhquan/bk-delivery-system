import customFetch from "./axios"

const create = data => {
    return customFetch.post('/order', data);
}

const get = () => {
    return customFetch.get('/order')
}

const getOrderById = (orderId) => {
    return customFetch.get(`/order/${orderId}`);
}

const getOrdersByUserId = ({userId, orderId = ''}) => {
    return customFetch.get(`/order/user/${userId}?orderId=${orderId}`);
}

const OrderService = {
    create,
    get,
    getOrderById,
    getOrdersByUserId
}

export default OrderService
