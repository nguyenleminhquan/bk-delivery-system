import FormInput from 'components/FormInput'
import React, { useEffect, useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai';
import { FaSearch } from 'react-icons/fa';
import './index.scss'
import { useDispatch, useSelector } from 'react-redux';
import { importOrderToStock } from 'features/stock/stockSlice';
import { getOrderById } from 'features/user/orderSlice';

function ImportOrder() {
	const { user } = useSelector(state => state.user);
	const { order } = useSelector(state => state.order);
	const dispatch = useDispatch();
	const [orderId, setOrderId] = useState('');
	const [orderInfo, setOrderInfo] = useState('');

	const handleSearch = (e) => {
		e.preventDefault();
		dispatch(getOrderById(orderId));
		setOrderInfo({
			id: '123123123',
			name: 'Phước Tài',
			price: '123.000đ'
		})
	}

	const handleImport = () => {
		const payload = {
			order_id: orderId,
			stock_id: '',
			stocker_id: user?._id,
		}
		dispatch(importOrderToStock(payload));
		setOrderId('');
		setOrderInfo('');
	}

	useEffect(() => {
		if (order?._id) {
			console.log(order);
			setOrderInfo({ id: order._id, name: order?.name, price: order?.price })
		}
	}, [order])

	return (
		<div className='import-order'>
			<form onSubmit={handleSearch}>
				<FormInput
					name='orderId'
					type="text"
					value={orderId}
					placeholderText="Nhập vào mã đơn hàng"
					handleChange={(e) => setOrderId(e.target.value)}
					icon={<FaSearch />}
				/>
			</form>
			{orderInfo && (
				<div className='order-info'>
					<span> {orderInfo.id} </span>
					<span> {orderInfo.name} </span>
					<span> {orderInfo.price} </span>
					<span className='import-btn' onClick={handleImport}><AiOutlinePlus /></span>
				</div>
      )}
		</div>
	)
}

export default ImportOrder