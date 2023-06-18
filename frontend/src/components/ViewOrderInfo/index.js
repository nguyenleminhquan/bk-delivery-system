import React from 'react'
import { FaPhone, FaUser } from 'react-icons/fa'
import { MdLocationOn } from 'react-icons/md'
import './index.scss'

function ViewOrderInfo({ orderInfo }) {
	
	return (
		<div className='view-order-info'>
			<div className='part'>
				<h4 className='fs-6'>Thông tin người gửi</h4>
				<p>
					<MdLocationOn />
					{orderInfo.sender_address}
				</p>
				<p>
					<FaUser />
					{orderInfo.sender_name}
				</p>
				<p>
					<FaPhone />
					{orderInfo.sender_phone}
				</p>
			</div>
			<div className='part'>
				<h4 className='fs-6'>Thông tin người nhận</h4>
				<p>
					<MdLocationOn />
					{orderInfo.receiver_address}
				</p>
				<p>
					<FaUser />
					{orderInfo.receiver_name}
				</p>
				<p>
					<FaPhone />
					{orderInfo.receiver_phone}
				</p>
			</div>
			<div className='part'>
				<h4 className='fs-6'>Chi tiết đơn hàng</h4>
				<div>
					<p>Mã đơn: {orderInfo.id}</p>
					<p>Số lượng: {orderInfo.quantity}</p>
					<p>Khối lượng: {orderInfo.weight}</p>
				</div>
				<table className='order-table'>
					<thead>
						<tr>
							<th>Sản phẩm</th>
							<th>Số lượng</th>
							<th>Khối lượng</th>
						</tr>
					</thead>
					<tbody>
						{orderInfo.items.map((item) => (
							<tr key={item._id}>
								<td> {item.name} </td>
								<td> {item.quantity} </td>
								<td> {item.weight} kg </td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default ViewOrderInfo