import FormInput from 'components/FormInput'
import React, { useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai';
import { FaSearch } from 'react-icons/fa';
import './index.scss'

function ImportOrder() {
	const [orderId, setOrderId] = useState('');
	const [orderInfo, setOrderInfo] = useState('');

	const handleSearch = (e) => {
		e.preventDefault();
		setOrderInfo({
			id: '123123123',
			name: 'Phước Tài',
			price: '123.000đ'
		})
	}

	const handleImport = () => {
		setOrderId('');
		setOrderInfo('');
	}

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