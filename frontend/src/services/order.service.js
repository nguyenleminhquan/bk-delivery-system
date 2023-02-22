import customFetch from "./axios"

const create = data => {
    return customFetch.post('/order', data);
}

const get = () => {
    return customFetch.get('/order')
}

const OrderService = {
    create,
    get
}

export default OrderService
