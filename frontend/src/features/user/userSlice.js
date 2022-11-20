import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { checkForUnauthorizedResponse } from "services/axios";
import { addUserToLocalStorage, getUserFromLocalStorage, removeUserFromLocalStorage } from "utils/localStorage";
import { clearStoreThunk, loginUserThunk, registerUserThunk } from "./userThunk";
import AuthService from 'services/auth.service'

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

// export const updateUser = createAsyncThunk(
//     'user/updateUser',
//     async(user, thunkAPI) => {
//         return updateUserThunk(user, thunkAPI);
//     }
// )

export const clearStore = createAsyncThunk('user/clearStore', clearStoreThunk);

export const testJWT = createAsyncThunk(
    'user/testJWT',
    async(_, thunkAPI) => {
        try {
            const res = await AuthService.test();
        } catch(err) {
            console.log(err)
            // return checkForUnauthorizedResponse(err, thunkAPI)
        }
    }
)

const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        logoutUser: (state, action) => {
            state.user = null;
            removeUserFromLocalStorage();
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
        },
        [registerUser.rejected]: (state) => {
            state.isLoading = false;
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
        },
        [loginUser.rejected]: (state) => {
            state.isLoading = false;
        },
        // [updateUser.pending]: (state) => {
        //     state.isLoading = true;
        // },
        // [updateUser.fulfilled]: (state, { payload }) => {
        //     const { user } = payload;
        //     state.isLoading = false;
        //     state.user = user;
        //     addUserToLocalStorage(user);
        // },
        // [updateUser.rejected]: (state) => {
        //     state.isLoading = false;
        // },
    }
})


export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;