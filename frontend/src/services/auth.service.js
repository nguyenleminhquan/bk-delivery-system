import customFetch from "./axios"

const login = (data) => {
    return customFetch.post('/user/login', data)
}

const register = (data) => {
    return customFetch.post('/user/register', data)
}

const getNewToken = (data) => {
    return customFetch.post('/user/token', data)
}

const test = () => {
    return customFetch.get('/user/test-jwt')
}

const AuthService = {
    login,
    register,
    getNewToken,
    test
}

export default AuthService