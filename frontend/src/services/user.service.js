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

const UserService = {
    updateUser,
    changePassword
}

export default UserService