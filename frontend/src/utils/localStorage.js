export const addUserToLocalStorage = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
}

export const getUserFromLocalStorage = () => {
    const result = localStorage.getItem('user');
    const user = result ? JSON.parse(result) : null;
    return user;
}

export const removeUserFromLocalStorage = () => {
    localStorage.removeItem('user');
}

export const getLocalRefreshToken = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.refresh_token;
}

export const getLocalAccessToken = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.token;
}

export const updateLocalAccessToken = (token) => {
    let user = JSON.parse(localStorage.getItem("user"));
    user.token = token;
    localStorage.setItem("user", JSON.stringify(user));
}