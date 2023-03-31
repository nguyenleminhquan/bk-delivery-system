import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { checkForUnauthorizedResponse } from "services/axios";
import { addUserToLocalStorage, getUserFromLocalStorage, removeUserFromLocalStorage } from "utils/localStorage";
import { changePasswordThunk, checkInDayThunk, clearStoreThunk, createEmployeeThunk, deleteUserThunk, getAllEmployeeThunk, loginUserThunk, registerUserThunk, updateUserThunk } from "./userThunk";
import AuthService from 'services/auth.service'
import { toast } from 'react-toastify'

const initialState = {
    user: getUserFromLocalStorage(),
    employees: [],
    isLoading: false,
}

export const registerUser = createAsyncThunk(
    'user/registerUser',
    async(user, thunkAPI) => {
        return registerUserThunk(user, thunkAPI);
    }
)

export const loginUser = createAsyncThunk(
    'user/loginUser',
    async(user, thunkAPI) => {
        return loginUserThunk(user, thunkAPI);
    }
)

export const updateUser = createAsyncThunk(
    'user/updateUser',
    async(user, thunkAPI) => {
        return updateUserThunk(user, thunkAPI);
    }
)

export const changePassword = createAsyncThunk(
    'user/changePassword',
    async(user, thunkAPI) => {
        return changePasswordThunk(user, thunkAPI)
    }
)

export const checkInDay = createAsyncThunk(
    'user/checkInDay',
    async(time, thunkAPI) => {
        return checkInDayThunk(time, thunkAPI);
    }
)

export const getAllEmployee = createAsyncThunk(
    'user/getAllEmployee',
    async(thunkAPI) => {
        return getAllEmployeeThunk(thunkAPI);
    }
)

export const createEmployee = createAsyncThunk(
    'user/createEmployee',
    async(employee, thunkAPI) => {
        return createEmployeeThunk(employee, thunkAPI);
    }
)

export const deleteUser = createAsyncThunk(
    'user/deleteUser',
    async(id, thunkAPI) => {
        return deleteUserThunk(id, thunkAPI);
    }
)

export const clearStore = createAsyncThunk('user/clearStore', clearStoreThunk);

export const testJWT = createAsyncThunk(
    'user/testJWT',
    async(user, thunkAPI) => {
        try {
            const res = await AuthService.test();
            const role = res.data.role;
            if (role !== user.typeUser) {
                thunkAPI.dispatch(clearStore());
		        return thunkAPI.rejectWithValue('Unauthorized! Logging Out...');
            }
        } catch(err) {
            console.log(err)
            return checkForUnauthorizedResponse(err, thunkAPI)
        }
    }
)

const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        logoutUser: (state, { payload }) => {
            state.user = null;
            removeUserFromLocalStorage();
            if (payload) {
                toast.success(payload);
            }
        }
    },
    extraReducers: {
        [registerUser.pending]: (state) => {
            state.isLoading = true;
        },
        [registerUser.fulfilled]: (state, { payload }) => {
            console.log(payload);
            const user = payload;
            state.isLoading = false;
            state.user = user;
            addUserToLocalStorage(user);
            toast.success(`Hello There, ${user.fullname}`);
        },
        [registerUser.rejected]: (state, { payload }) => {
            state.isLoading = false;
            toast.error(payload);
        },
        [loginUser.pending]: (state) => {
            state.isLoading = true;
        },
        [loginUser.fulfilled]: (state, { payload }) => {
            console.log(payload);
            const user = payload;
            state.isLoading = false;
            state.user = user;
            addUserToLocalStorage(user);
            toast.success(`Welcome Back ${user.fullname}`);
        },
        [loginUser.rejected]: (state, { payload }) => {
            state.isLoading = false;
            toast.error(payload);
        },
        [updateUser.pending]: (state) => {
            state.isLoading = true;
        },
        [updateUser.fulfilled]: (state, { payload }) => {
            const { data } = payload;
            state.isLoading = false;
            state.user = data;
            addUserToLocalStorage(data);
            toast.success('User Updated!')
        },
        [updateUser.rejected]: (state, { payload }) => {
            state.isLoading = false;
            toast.error(payload);
        },
        [changePassword.pending]: (state) => {
            state.isLoading = true;
        },
        [changePassword.fulfilled]: (state) => {
            state.isLoading = false;
            toast.success('Change Password Successfully!')
        },
        [changePassword.rejected]: (state, { payload }) => {
            state.isLoading = false;
            toast.error(payload);
        },
        // [testJWT.rejected]: (state, { payload }) => {
        //     toast.error(payload)
        // }

        [checkInDay.rejected]: (state, {payload}) => {
            state.isLoading = false;
            toast.error(payload);
        },
        [checkInDay.pending]: (state) => {
            state.isLoading = true;
        },
        [checkInDay.fulfilled]: (state) => {
            state.isLoading = false;
            toast.success('Điểm danh thành công!');
        },
        [getAllEmployee.pending]: state => {
            state.isLoading = true;
        },
        [getAllEmployee.fulfilled]: (state, {payload}) => {
            state.employees = payload;
            state.isLoading = false;
        },
        [getAllEmployee.rejected]: (state, {payload}) => {
            state.isLoading = false;
            toast.error(payload);
        },
        [createEmployee.pending]: state => {
            state.isLoading = true;
        },
        [createEmployee.rejected]: (state, {payload}) => {
            state.isLoading = false;
            toast.error(payload);
        },
        [createEmployee.fulfilled]: (state, {payload}) => {
            state.isLoading = false;
            state.employees.push(payload);
        },
        [deleteUser.pending]: state => {
            state.isLoading = true;
        },
        [deleteUser.rejected]: (state, {payload}) => {
            state.isLoading = false;
            toast.error(payload);
        },
        [deleteUser.fulfilled]: (state, {payload}) => {
            state.isLoading = false;
            // Update lai employee...
            state.employees = state.employees.filter(employee => employee._id !== payload._id);
            toast.success('Xóa người dùng thành công.');
        }
    }
})


export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;