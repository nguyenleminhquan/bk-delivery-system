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

const UserService = {
    updateUser,
    changePassword,
    checkInDay,
    getAllEmployee
}

export default UserService