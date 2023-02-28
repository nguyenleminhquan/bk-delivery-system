import customFetch from "./axios"

const create = data => {
    return customFetch.post('/order', data);
}

const get = () => {
    return customFetch.get('/order')
}

const getOrdersByUserId = (userId) => {
    return customFetch.get(`/order/user/${userId}`)
}

const OrderService = {
    create,
    get,
    getOrdersByUserId
}

export default OrderService
