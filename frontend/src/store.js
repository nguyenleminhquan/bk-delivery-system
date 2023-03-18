import { configureStore } from '@reduxjs/toolkit';
import deliverySlice from 'features/delivery/deliverySlice';
import stockSlice from 'features/stock/stockSlice';
import orderSlice from 'features/user/orderSlice';
import userSlice from './features/user/userSlice';

export const store = configureStore({
	reducer: {
		user: userSlice,
		delivery: deliverySlice,
		order: orderSlice,
		stock: stockSlice,
	}
})