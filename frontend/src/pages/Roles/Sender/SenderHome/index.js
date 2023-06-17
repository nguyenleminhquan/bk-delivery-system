import { BsSearch } from 'react-icons/bs'
import { BiPencil } from 'react-icons/bi'
import React, { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import styles from './Sender.module.scss'
import { getOrdersByUserId } from 'features/user/orderSlice';
import { FaEdit, FaEye, FaTrashAlt } from 'react-icons/fa';
import { orderStatusList } from 'utils/constants';
import SpecificSenderOrder from 'components/SpecificSenderOrder';
import moment from 'moment/moment';
import { SocketContext } from 'index';
import { toast } from 'react-toastify';
import ConfirmPopup from 'components/ConfirmPopup';

const tabs = [
	{
		field: 'all',
		name: 'Tất cả'
	},
	{
		field: 'waiting',
		name: 'Đang xử lý'
	},
	{
		field: 'accepted',
		name: 'Được nhận'
	},
	{
	  	field: 'picked',
	  	name: 'Đã lấy hàng',
	},
	{
	  	field: 'delivering',
	  	name: 'Đang giao hàng',
	},
	{
	  	field: 'success',
	  	name: 'Giao thành công',
	},
]

function SenderHome() {
	const { user } = useSelector((state) => state.user);
	const { orders } = useSelector((state) => state.order);
	const [updatedOrders, setUpdatedOrders] = useState([]);
	const [ordersByStatus, setOrdersByStatus] = useState([]);
	const [showSpecificOrder, setShowSpecificOrder] = useState(false);
	const [specificOrder, setSpecificOrder]= useState('');
	const [selectedTab, setSelectedTab] = useState(tabs[0]);
	const [toggleDeletePopup, setToggleDeletePopup] = useState(false);
	const dispatch = useDispatch();
	const socket = useContext(SocketContext);

	const handleDeleteOrder = (order) => {
		if (order.status === 'waiting') {
			socket.emit('deleteOrder', {
				order_id: order._id
			})
			socket.emit('deleteDelivery', {
				order_id: order._id
			})
			toast.success('Xóa đơn hàng thành công')
		}
		else {
			toast.warning('Đơn hàng đã được nhận, không thể xóa')
		}
	}

	useEffect(() => {
		dispatch(getOrdersByUserId(user.id))
	}, [dispatch, user.id])

	useEffect(() => {
		setUpdatedOrders(orders)
	}, [orders])

	useEffect(() => {
		console.log('updatedOrder', updatedOrders)
		socket.on('updateOrderStatus', (data) => {
			const { order_id, status, date } = data;
			const tempOrders = JSON.parse(JSON.stringify(updatedOrders))
			tempOrders.forEach((order) => {
				if (order._id === order_id) {
					order.status = status
					order.tracking[status] = date;
				}
			})
			setUpdatedOrders(tempOrders)
		})
		socket.on('deleteOrder', (data) => {
			const { order_id } = data;
			const tempOrders = updatedOrders.filter((item) => item._id !== order_id);
			setUpdatedOrders(tempOrders)
		}) 
	}, [socket, updatedOrders])

	useEffect(() => {
		if (selectedTab.field === 'all') {
			setOrdersByStatus(updatedOrders)
		}
		else if (selectedTab.field === 'delivering') {
			setOrdersByStatus(updatedOrders.filter((order) => 
				order.status === 'arrived_send_stock' ||
				order.status === 'coming_dest_stock' ||
				order.status === 'arrived_dest_stock' ||
				order.status === 'delivering'
			))
		}
		else {
			setOrdersByStatus(updatedOrders.filter((order) => order.status === selectedTab.field))
		}
	}, [selectedTab, updatedOrders])

	return (
		<div>
			{/* Header bar */}
			<div className='d-flex'>
				<div className={styles.searchBar}>
					<BsSearch />
					<input type="text" placeholder='Nhập mã đơn hàng' className='ms-5' />
				</div>
				<Link className='btn fs-6' to="/create-order">
					<BiPencil className='me-3'/> Tạo đơn hàng
				</Link>
			</div>

			{/* General */}
			<div className='mb-3'>
				<h2 className='pt-5 pb-3 fs-5'>Tổng quan</h2>
				<div className="filter d-flex align-items-center">
					<div className={`${styles.orderFilter} ${styles.orderFilter1}`}>
						<p className='font-weight-bold fs-1'>2</p>
						<p>Đã lấy hàng</p>
					</div>

					<div className={`${styles.orderFilter} ${styles.orderFilter2}`}>
						<p className='font-weight-bold fs-1'>1</p>
						<p>Chưa lấy hàng</p>
					</div>

				</div>
			</div>

			<h2 className='pt-4 pb-3 fs-5'>Danh sách đơn hàng</h2>
			<ul className={styles.tabHeader}>
				{tabs.map(tab => (
				<li key={tab.name} 
					className={selectedTab.field === tab.field ? `${styles.tabHeaderItem} ${styles.active}` : `${styles.tabHeaderItem}`}
					onClick={() => setSelectedTab(tab)}
				>{tab.name}</li>
				))}
			</ul>

			{/* Order List */}
			{
				ordersByStatus.length === 0 
				? <p className='fs-3 text-center'> Không tìm thấy đơn hàng phù hợp </p>
				:
				<div className={styles.orderList}>
					{
						ordersByStatus.map((order) => (
							<div key={order._id} className={styles.order}>
								<div className={styles.orderOverlay}></div>
								<ul className={styles.orderIcons}>
									<li className={styles.orderIcon} onClick={() => {
										setShowSpecificOrder(true)
										setSpecificOrder(order)}}>
										<FaEye />
									</li>
									<li className={styles.orderIcon}>
										<FaEdit />
									</li>
									<li className={styles.orderIcon} onClick={() => {
										setToggleDeletePopup(true);
										setSpecificOrder(order);
									}}>
										<FaTrashAlt />
									</li>
								</ul>
								<div className={styles.orderInfo}>
									<div><p className={styles.orderTitles}>Mã đơn hàng</p> {order._id}</div>
									<div><p className={styles.orderTitles}>Thời gian tạo</p> {moment(order.createdAt).format('DD-MM-YYYY HH:mm:ss')} </div>
									<div><p className={styles.orderTitles}>Phí vận chuyển</p> {order.shipping_fee}đ</div>
									<div><p className={styles.orderTitles}>Trạng thái</p> {orderStatusList[order.status]}</div>
								</div>
								<div className=''>
									<p className={styles.orderTitles}>Địa chỉ người nhận</p> 
									<p> {order.receiver_address} </p>
								</div>
								<div>
									<p className='fw-bold mb-1'>Sản phẩm</p>
									<div className={styles.itemList}>
										{
											order.items.map((item) => (
												<p key={item._id} className={styles.item} > {item.name} x {item.quantity} </p>
											))
										}
									</div>
								</div>
								{/* <div className={styles.iconList}>
									<div className={`${styles.icon} ${styles.green}`} onClick={() => {
										setShowSpecificOrder(true)
										setSpecificOrder(order)
									}}>
										<FaEye />
										<span>Xem chi tiết</span>
									</div>
									<div className={`${styles.icon} ${styles.blue}`}>
										<FaEdit />
										<span>Chỉnh sửa</span>
									</div>
									<div className={`${styles.icon} ${styles.red}`} onClick={() => handleDeleteOrder(order)}>
										<FaTrashAlt />
										<span>Xóa</span>
									</div>
								</div> */}
							</div>
						))
					}
				</div>
			}

			{
				showSpecificOrder && <SpecificSenderOrder order={specificOrder} closeModal={() => setShowSpecificOrder(false)} />
			}
			{
				toggleDeletePopup && (
					<ConfirmPopup
						title="Bạn có chắc muốn xóa đơn hàng này chứ?"
						actionNo={() => setToggleDeletePopup(false)}
						actionYes={() => {
							handleDeleteOrder(specificOrder);
							setToggleDeletePopup(false);
						}}
						cancelLabel="Đóng lại"
						okLabel="Xóa"
					/>
				)
			}

		</div>
	)
}

export default SenderHome