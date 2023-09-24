import customFetch from "./axios";

const updateUser = ({ userId, info }) => {
    return customFetch.post(
        `/user/${userId}/update`,
        info
    )
}

const changePassword = ({ userId, oldPass, newPass }) => {
    return customFetch.post(
        `/user/${userId}/change-password`,
        {
            oldPass: oldPass,
            newPass: newPass
        }
    )
}

export const checkInDay = ({time}) => {
    return customFetch.post('/user/working-day', time);
}

export const getAllEmployee = () => {
    return customFetch.get('/user/employee');
}

export const createEmployee = (payload) => {
    return customFetch.post('/user/create-account', payload);
}

export const editEmployee = ({id, info}) => {
    return customFetch.post(`/user/edit-account/${id}`, info);
}

export const deleteUser = (userId) => {
    return customFetch.delete(`/user/${userId}`);
}

export const getAllSupportRequest = () => {
    return customFetch.get('/support-request');
}

const UserService = {
    updateUser,
    changePassword,
    checkInDay,
    getAllEmployee,
    createEmployee,
    editEmployee,
    deleteUser,
    getAllSupportRequest
}

export default UserService