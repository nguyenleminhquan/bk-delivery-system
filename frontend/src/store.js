import { configureStore } from '@reduxjs/toolkit';
import deliverySlice from 'features/delivery/deliverySlice';
import orderSlice from 'features/user/orderSlice';
import userSlice from './features/user/userSlice';

export const store = configureStore({
	reducer: {
		user: userSlice,
		delivery: deliverySlice,
		order: orderSlice
	}
})