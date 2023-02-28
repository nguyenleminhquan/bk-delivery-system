import React from 'react'
import { MdLocationOn } from 'react-icons/md'
import './index.scss'

function ViewOrderInfo({ orderInfo }) {
	console.log('orderInfo', orderInfo.sender_address)
	return (
		<div className='view-order-info'>
			<div className='part'>
				<h4 className='fs-6'>Thông tin người gửi</h4>
				<p>
					<MdLocationOn />
					{orderInfo.sender_address}
				</p>
			</div>
			<div className='part'>
				<h4 className='fs-6'>Thông tin người nhận</h4>
				<p>
					<MdLocationOn />
					{orderInfo.receiver_address}
				</p>
				
			</div>
			<div className='part'>
				<h4 className='fs-6'>Chi tiết đơn hàng</h4>
				<div>
					<p>Số lượng: {orderInfo.quantity}</p>
					<p>Khối lượng: {orderInfo.weight}</p>
				</div>
				<table className='table'>
						<thead>
							<tr>
								<td>Sản phẩm</td>
								<td>Giá</td>
								<td>Số lượng</td>
							</tr>
						</thead>
						<tbody>
							{orderInfo.items.map((item) => (
								<tr key={item._id}>
									<td> {item.name} </td>
									<td> 120.000 </td>
									<td> {item.quantity} </td>
								</tr>
							))}
						</tbody>
				</table>
			</div>
		</div>
	)
}

export default ViewOrderInfo