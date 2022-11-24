import customFetch from "./axios"

const login = ({ email, password }) => {
    return customFetch.post(
        '/user/login', 
        {
            email: email,
            password: password
        }
    )
}

const register = ({ fullname, email, phone, password, typeUser }) => {
    return customFetch.post(
        '/user/register', 
        {
            fullname: fullname,
            email: email,
            phone: phone,
            password: password,
            typeUser: typeUser
        }
    )
}

const getNewToken = ({ refresh_token }) => {
    return customFetch.post(
        '/user/token', 
        {
            refresh_token: refresh_token
        }
    )
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