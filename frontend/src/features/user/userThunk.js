import { clearAllDeliveriesState } from "features/delivery/deliverySlice";
import AuthService from "services/auth.service";
import { checkForUnauthorizedResponse } from "services/axios";
import UserService from "services/user.service";
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

export const updateUserThunk = async(user, thunkAPI) => {
    try {
        const res = await UserService.updateUser(user);
        console.log(res.data)
        return res.data
    } catch(error) {
        console.log(error);
        return checkForUnauthorizedResponse(error, thunkAPI);
    }
}

export const changePasswordThunk = async(user, thunkAPI) => {
    try {
        const res = await UserService.changePassword(user);
        return res.data
    } catch(error) {
        console.log(error);
        return checkForUnauthorizedResponse(error, thunkAPI);
    }
}

export const clearStoreThunk = async(message, thunkAPI) => {
    try {
        thunkAPI.dispatch(logoutUser(message));
        thunkAPI.dispatch(clearAllDeliveriesState())
        return Promise.resolve();
    } catch(error) {
        return Promise.reject();
    }
}

export const checkInDayThunk = async(time, thunkAPI) => {
    try {
        const res = await UserService.checkInDay(time);
        return res.data;
    } catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
}

export const getAllEmployeeThunk = async(thunkAPI) => {
    try {
        const res = await UserService.getAllEmployee();
        return res.data;
    } catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
}

export const deleteUserThunk = async(id, thunkAPI) => {
    try {
        const res = await UserService.deleteUser(id);
        return res.data;    
    } catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
}

export const createEmployeeThunk = async(employee, thunkAPI) => {
    try {
        const res = await UserService.createEmployee(employee, thunkAPI);
        return res.data;
    } catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
}