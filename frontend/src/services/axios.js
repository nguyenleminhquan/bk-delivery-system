import axios from "axios";
import { clearStore } from "features/user/userSlice";
import { getLocalAccessToken, getLocalRefreshToken, getUserFromLocalStorage, updateLocalAccessToken } from "utils/localStorage";
import AuthService from "./auth.service";

const customFetch = axios.create({
	baseURL: 'http://34.124.177.159:2376',
	// baseURL: 'http://localhost:5000'
})

customFetch.interceptors.request.use(
	(config) => {
		const token = getLocalAccessToken();
		const refresh_token = getLocalRefreshToken();
		console.log('token', token)
		console.log('refresh token', refresh_token)
		if (token && refresh_token) {
			config.headers['Authorization'] = `Bearer ${refresh_token} ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error)
	}
);
	
	
export const checkForUnauthorizedResponse = async (error, thunkAPI) => {
	console.log("error respone", error.response.data.msg)
	if (error.response.data.msg === 'Access token expired') {
		try {
			const res = await AuthService.getNewToken({
				refresh_token: getLocalRefreshToken()
			});
			const { token } = res.data;
	 		updateLocalAccessToken(token);
			return;
		} catch (err) {
			return thunkAPI.rejectWithValue(error.response.data.msg);
		}
	}
	if (error.response.data.msg === 'Refresh token expired') {
		thunkAPI.dispatch(clearStore());
		return thunkAPI.rejectWithValue('Unauthorized! Logging Out...');
	}
	return thunkAPI.rejectWithValue(error.response.data.msg);
};


export default customFetch;