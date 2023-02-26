import { configureStore } from '@reduxjs/toolkit';
import deliverySlice from 'features/delivery/deliverySlice';
import userSlice from './features/user/userSlice';

export const store = configureStore({
	reducer: {
		user: userSlice,
		delivery: deliverySlice
	}
})