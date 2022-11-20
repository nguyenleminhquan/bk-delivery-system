import axios from "axios";
import { clearStore } from "features/user/userSlice";
import { getLocalAccessToken, getLocalRefreshToken, getUserFromLocalStorage, updateLocalAccessToken } from "utils/localStorage";
import AuthService from "./auth.service";

const customFetch = axios.create({
	baseURL: 'http://34.124.177.159:2376',
})

export const setupInterceptors = (store) => {
	const { dispatch } = store;

	customFetch.interceptors.request.use(
		(config) => {
			const token = getLocalAccessToken();
			console.log('token', token)
			if (token) {
				config.headers['Authorization'] = `Bearer ${token}`;
			}
			return config;
		},
		(error) => {
			return Promise.reject(error)
		}
	);
	
	customFetch.interceptors.response.use(
		(res) => {
			console.log("resdgfg")
			return res;
		},
		async (err) => {
			const originalConfig = err.config;
			console.log(err.response)
			if (originalConfig.url !== "/user/login" && err.response) {
				// Access Token was expired
				if (err.response.status === 403 && !originalConfig._retry) {
					console.log('there')
					console.log('token expired')
					originalConfig._retry = true;
	
					try {
						const rs = await AuthService.getNewToken({
							refresh_token: getLocalRefreshToken()
						});
	
						const { token } = rs.data;
						updateLocalAccessToken(token);
	
						return customFetch(originalConfig);
					} catch (_error) {
						console.log("retre")
						dispatch(clearStore());
						return Promise.reject(_error);
					}
				}
			}
	
			return Promise.reject(err);
		}
	);
	
	// export const checkForUnauthorizedResponse = (error, thunkAPI) => {
	// 	console.log("error respone", error.response.status)
	// 	if (error.response.status === 401) {
	// 		thunkAPI.dispatch(clearStore());
	// 		return thunkAPI.rejectWithValue('Unauthorized! Logging Out...');
	// 	}
	// 	return thunkAPI.rejectWithValue(error.response.data.msg);
	// };
}



export default customFetch;