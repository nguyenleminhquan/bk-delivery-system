import AuthService from "services/auth.service";
import { logoutUser } from "./userSlice";

export const registerUserThunk = async(user, thunkAPI) => {
    try {
        const res = await AuthService.register(user);
        return res.data
    } catch(error) {
        console.log(error);
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
}

export const loginUserThunk = async(user, thunkAPI) => {
    try {
        const res = await AuthService.login(user);
        return res.data
    } catch(error) {
        console.log(error);
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
}

// export const updateUserThunk = async(url, user, thunkAPI) => {
//     try {
//         const res = await customFetch.patch(url, user);
//         return res.data
//     } catch(error) {
//         console.log(error);
//         return thunkAPI.rejectWithValue(error.response.data.msg);
//     }
// }

export const clearStoreThunk = async(_, thunkAPI) => {
    try {
        thunkAPI.dispatch(logoutUser());
        return Promise.resolve();
    } catch(error) {
        return Promise.reject();
    }
}