import React, { useState } from 'react'
import './index.scss'
import ConfirmPopup from 'components/ConfirmPopup';
import ViewOrderInfo from 'components/ViewOrderInfo';
import { toast } from 'react-toastify';

function DeliveryOrder({ delivery }) {
	const { from, to, btns } = delivery;
	const [togglePopup, setTogglePopup] = useState(false);
	const [selectedBtn, setSelectedBtn] = useState('');

	const { order } = delivery;
    const { items } = order;
    const orderPopop = {
        id: order._id,
        sender_address: order.sender_address,
        sender_name: order.sender_name,
        sender_phone: order.sender_phone,
        receiver_address: order.receiver_address,
        receiver_name: order.receiver_name,
        receiver_phone: order.receiver_phone,
        quantity: items.length,
        weight: order.weight,
        items: items
      }

	return (
		<div className='delivery-order'>
			{/* <div className='timeout'> 60 </div> */}
			<div className='info'>
				<div className='address'>
					<div className='circle circle-1'></div>
					<div className='text'>
						<p>Bên gửi: { from.split('&')[0] } </p>
						<p> { from.split('&')[1] } </p>
					</div>
				</div>
				<div className='address'>
					<div className='circle circle-2'></div>
					<div className='text'>
						<p>Bên nhận: { to.split('&')[0] } </p>
						<p> { to.split('&')[1] } </p>
					</div>
				</div>
			</div>
			<div className='action-btns'>
				{
					btns.map((btn) => (
						<button 
							key={btn.id} 
							onClick={() => {
								setTogglePopup(true);
								setSelectedBtn(btn);
							}} 
							className='btn btn-medium' 
						> 
							{ btn.text } 
						</button>
					))
				}
				{/* <button className='btn btn-medium fs-6'>Xem đơn hàng</button> */}
			</div>
			{
				togglePopup && (
					selectedBtn.id === 'viewOrder' ?
					<ConfirmPopup 
						title='Thông tin đơn hàng'
						content={<ViewOrderInfo orderInfo={orderPopop} />}
						actionNo={() => setTogglePopup(false)}
						cancelLabel="Đóng lại"
					/> :
					<ConfirmPopup 
						title={
							selectedBtn.id === 'accept' 
							? 'Bạn đồng ý nhận đơn hàng này chứ?'
							: selectedBtn.id === 'picked'
							? 'Bạn xác nhận đã lấy đơn hàng này?'
							: selectedBtn.id === 'deliveried'
							? 'Bạn xác nhận đã giao xong đơn hàng này?'
							: 'Bạn muốn hủy đơn hàng này?'
						}
						actionNo={() => setTogglePopup(false)}
						actionYes={() => {
							selectedBtn.action();
							setTogglePopup(false);
							if (selectedBtn.id === 'cancel') {
								toast.success('Đã hủy đơn hàng')
							} else {
								toast.success('Đã cập nhật trạng thái đơn hàng')
							}
						}}
						cancelLabel="Đóng lại"
						okLabel="Xác nhận"
					/>
				)
			}
		</div>
	)
}

export default DeliveryOrder