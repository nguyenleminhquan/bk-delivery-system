// Libraries import
import React, { Fragment, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip } from 'react-tooltip';

// Components import
import FormInput from 'components/FormInput'
import { SocketContext } from 'index';

// Ultils import
import { clearVehicleOrders, getVehicleOrders } from 'features/delivery/deliverySlice';
import { getStockOrders, importOrderToStock } from 'features/stock/stockSlice';
import { resetOrder } from 'features/user/orderSlice';
import { formatCurrency } from 'utils/constants';

// Icons import
import { AiOutlineSearch } from 'react-icons/ai';
import { FaSearch } from 'react-icons/fa';

// Css import
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
		dispatch(getVehicleOrders({vehicle_id: vehicleId, stock_id: user.stock_id}));
	}

	const handleImport = () => {
		const importPayload = {
			order_ids: vehicleOrders.map(order => order._id),
			stock_id: user?.stock_id,
			stocker_id: user?.id,
			vehicle_id: vehicleId 
		}
		dispatch(importOrderToStock({importPayload, vehicleOrders, socket}));
		setVehicleId('');
		setOrders([]);
		handleClose();
		dispatch(resetOrder());
		dispatch(getStockOrders(user?.stock_id));
	}

	const handleClose = () => {
		dispatch(clearVehicleOrders());
		closePopup();
	}

	useEffect(() => {
		if (vehicleOrders) {
			setOrders(vehicleOrders);
		}
	}, [vehicleOrders]);

	return (
		<div className='import-order'>
			<label>Mã xe/Biển số xe tải</label>
			<div className="d-flex">
				<form className='flex-fill' onSubmit={handleSearch}>
					<FormInput
						name='orderId'
						type="text"
						value={vehicleId}
						placeholderText="Nhập vào mã xe/biển số xe tải"
						handleChange={(e) => setVehicleId(e.target.value)}
						icon={<FaSearch />}
					/>
				</form>
				<button className='btn ms-2 fs-14 m-0 d-none d-sm-block' onClick={handleSearch}>Tìm kiếm</button>
				<button className='btn btn-icon d-block d-sm-none' onClick={handleSearch}>
					<AiOutlineSearch />
				</button>
			</div>
			
			{vehicleOrders.length > 0 && (
				<Fragment>
					<div className="order-info-header">
						<div className="order-info-wrapper fw-bold">
							<span>Mã đơn</span>
							<span>Tên người gửi</span>
							<span>Tổng khối lượng</span>
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
								<span data-tooltip-id="orderWeight" data-tooltip-content={order.weight}>{order.weight} kg</span>
								<Tooltip id="orderWeight" />
							</div>
						))}
					</div>
				</Fragment>
      )}
			<div className="actions text-end mt-2">
				<button className="btn btn-medium" style={{backgroundColor: '#6C757D'}} onClick={handleClose}>Hủy bỏ</button>
				{orders.length > 0 && (<button className="btn btn-medium" onClick={handleImport}>Thêm vào kho</button>)}
			</div>
		</div>
	)
}

export default ImportOrder
