import React from 'react'
import './index.scss'

function DeliveryOrder({ delivery }) {
	const { from, to, btns } = delivery;
	return (
		<div className='delivery-order'>
			<div className='timeout'> 60 </div>
			<div className='info'>
				<div className='address'>
					<div className='circle circle-1'></div>
					<div className='text'>
						<p>Lấy: { from.split('&')[0] } </p>
						<p> { from.split('&')[1] } </p>
					</div>
				</div>
				<div className='address'>
					<div className='circle circle-2'></div>
					<div className='text'>
						<p>Giao: { to.split('&')[0] } </p>
						<p> { to.split('&')[1] } </p>
					</div>
				</div>
			</div>
			<div className='action-btns'>
				{
					btns.map((btn) => (
						<button key={btn.id} onClick={btn.action} className='btn btn-medium' > { btn.text } </button>
					))
				}
				{/* <button className='btn btn-medium fs-6'>Xem đơn hàng</button> */}
			</div>
		</div>
	)
}

export default DeliveryOrder