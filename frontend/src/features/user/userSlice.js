import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { checkForUnauthorizedResponse } from "services/axios";
import { addUserToLocalStorage, getUserFromLocalStorage, removeUserFromLocalStorage } from "utils/localStorage";
import { changePasswordThunk, clearStoreThunk, loginUserThunk, registerUserThunk, updateUserThunk } from "./userThunk";
import AuthService from 'services/auth.service'
import { toast } from 'react-toastify'

const initialState = {
    user: getUserFromLocalStorage(),
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
    }
})


export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;