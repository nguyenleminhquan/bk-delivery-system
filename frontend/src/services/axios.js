import axios from "axios";
import { clearStore } from "features/user/userSlice";
import { getLocalAccessToken, getLocalRefreshToken, getUserFromLocalStorage, updateLocalAccessToken } from "utils/localStorage";
import AuthService from "./auth.service";
const envConfig = require('../config/.env.json')

const customFetch = axios.create({
	baseURL: envConfig.baseURL
})

customFetch.interceptors.request.use(
	(config) => {
		const token = getLocalAccessToken();
		const refresh_token = getLocalRefreshToken();
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
