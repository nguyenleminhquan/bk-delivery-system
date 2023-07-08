import FormInput from 'components/FormInput'
import React, { Fragment, useContext, useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { importOrderToStock } from 'features/stock/stockSlice';
import { resetOrder } from 'features/user/orderSlice';
import { clearVehicleOrders, getVehicleOrders } from 'features/delivery/deliverySlice';
import { SocketContext } from 'index';
import { Tooltip } from 'react-tooltip';
import './index.scss'

function ImportOrder({closePopup}) {
	const { user } = useSelector(state => state.user);
	const { vehicleOrders } = useSelector(state => state.delivery);
	const dispatch = useDispatch();
	const [vehicleId, setVehicleId] = useState('');
	const [orders, setOrders] = useState([]);
	const socket = useContext(SocketContext);

	const handleSearch = (e) => {
		e.preventDefault();
		dispatch(getVehicleOrders(vehicleId));
	}

	const handleImport = () => {
		const payload = {
			order_id: vehicleOrders.map(order => order._id),
			stock_id: user?.stock_id,
			stocker_id: user?.id,
		}
		dispatch(importOrderToStock(payload));
		// socket.emit('updateOrderStatus', {
    //         order_id: payload.order_id,
    //         status: 'import',
    //         date: new Date()
    //     })
	  setVehicleId('');
	  setOrders([]);
		closePopup();
		dispatch(resetOrder());
		dispatch(clearVehicleOrders());
	}

	useEffect(() => {
		if (vehicleOrders) {
			setOrders(vehicleOrders);
		}
	}, [vehicleOrders]);

	return (
		<div className='import-order'>
			<label>Mã xe tải</label>
			<form onSubmit={handleSearch}>
				<FormInput
					name='orderId'
					type="text"
					value={vehicleId}
					placeholderText="Nhập vào mã xe tải"
					handleChange={(e) => setVehicleId(e.target.value)}
					icon={<FaSearch />}
				/>
			</form>
			
			{vehicleOrders.length > 0 && (
				<Fragment>
					<div className="order-info-header">
						<div className="order-info-wrapper fw-bold">
							<span>Mã đơn</span>
							<span>Tên người gửi</span>
							<span>Tổng tiền</span>
						</div>
						<div style={{width: '25px'}}></div>
					</div>
					<div className='order-lists'>
						{orders.map(order => (
							<div className="order-info-wrapper" key={order._id}>
								<span data-tooltip-id="orderId" data-tooltip-content={order._id}> {order._id} </span>
								<Tooltip id="orderId" />
								<span data-tooltip-id="orderName" data-tooltip-content={order.sender_name}> {order.sender_name} </span>
								<Tooltip id="orderName" />
								<span data-tooltip-id="orderPrice" data-tooltip-content={order.shipping_fee}> {order.shipping_fee} đ</span>
								<Tooltip id="orderPrice" />
							</div>
						))}
					</div>
				</Fragment>
      )}
			<div className="actions text-end mt-3">
				<button className="btn btn-medium" style={{backgroundColor: '#6C757D'}} onClick={closePopup}>Hủy bỏ</button>
				<button className="btn btn-medium" onClick={handleImport}>Thêm vào kho</button>
			</div>
		</div>
	)
}

export default ImportOrder
