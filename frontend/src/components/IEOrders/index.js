import React from 'react'
import './index.scss';

function IEOrders({ orders }) {
  return (
    <div className='ieorders'>
			{
				orders.map((order) => 
					<div key={order._id} className='order-item'>
						<h6> { order._id } </h6>
						<p>Người gửi: { order.sender_name }</p>
						<p>Người nhận: { order.receiver_name } </p>
						<p>Địa chỉ gửi: { order.sender_address }</p>
						<p>Địa chỉ nhận: { order.receiver_address }</p>
						<p>Hàng hóa: {order.items.map((item, index) => {
							if (index === order.items.length - 1) {
								return <span>{item.name} - {item.weight}kg</span>
							} else {
								return <span>{item.name} - {item.weight}kg, </span>
							}
						})} 
						</p>
					</div>
				)
			}
		</div>
  )
}

export default IEOrders