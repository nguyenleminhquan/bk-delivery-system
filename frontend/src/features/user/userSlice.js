import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { checkForUnauthorizedResponse } from "services/axios";
import { addUserToLocalStorage, getUserFromLocalStorage, removeUserFromLocalStorage } from "utils/localStorage";
import { changePasswordThunk, checkInDayThunk, clearStoreThunk, createEmployeeThunk, deleteUserThunk, editEmployeeThunk, getAllEmployeeThunk, getAllSupportRequestThunk, loginUserThunk, registerUserThunk, updateUserThunk } from "./userThunk";
import AuthService from 'services/auth.service'
import { toast } from 'react-toastify'
import { EmployeeManagementToast } from "utils/enums";

const initialState = {
    user: getUserFromLocalStorage(),
    employees: [],
    supportRequests: [],
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

export const editEmployee = createAsyncThunk(
    'user/editEmployee',
    async(employee, thunkAPI) => {
        return editEmployeeThunk(employee, thunkAPI);
    }
)

export const deleteUser = createAsyncThunk(
    'user/deleteUser',
    async(id, thunkAPI) => {
        return deleteUserThunk(id, thunkAPI);
    }
)

export const getAllSupportRequest = createAsyncThunk(
    'user/getAllSupportRequest',
    async(thunkAPI) => {
        return getAllSupportRequestThunk(thunkAPI);
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
            const user = payload;
            state.isLoading = false;
            state.user = user;
            addUserToLocalStorage(user);
            toast.success(`Xin chào ${user.fullname}`);
        },
        [registerUser.rejected]: (state, { payload }) => {
            state.isLoading = false;
            toast.error(payload);
        },
        [loginUser.pending]: (state) => {
            state.isLoading = true;
        },
        [loginUser.fulfilled]: (state, { payload }) => {
            const user = payload;
            state.isLoading = false;
            state.user = user;
            addUserToLocalStorage(user);
            toast.success(`Chào mừng ${user.fullname} trở lại`);
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
            toast.success('Đã cập nhật thông tin cá nhân!')
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
            toast.success('Đổi mật khẩu thành công!')
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
            toast.success(EmployeeManagementToast.CREATE_EMPLOYEE_SUCCESSFUL);
        },
        [editEmployee.pending]: state => {
            state.isLoading = true;
        },
        [editEmployee.rejected]: (state, {payload}) => {
            state.isLoading = false;
            toast.error(payload);
        },
        [editEmployee.fulfilled]: (state, {payload}) => {
            state.isLoading = false;
            state.employees = state.employees.map(employee => {
                if (employee._id === payload.data.id) {
                    return {...payload.data, _id: payload.data.id};
                }
                return employee;
            });
            toast.success(EmployeeManagementToast.UPDATE_EMPLOYEE_SUCCESSFUL);
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
            toast.success(EmployeeManagementToast.DELETE_EMPLOYEE_SUCCESSFUL);
        },
        [getAllSupportRequest.pending]: state => {
            state.isLoading = true;
        },
        [getAllSupportRequest.fulfilled]: (state, {payload}) => {
            state.supportRequests = payload;
            state.isLoading = false;
        },
        [getAllSupportRequest.rejected]: (state, {payload}) => {
            state.isLoading = false;
            toast.error(payload);
        },
    }
})


export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;