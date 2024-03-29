// Libraries import
import React, { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment/moment';
import { toast } from 'react-toastify';

// Components import
import SpecificSenderOrder from 'components/SpecificSenderOrder';
import ConfirmPopup from 'components/ConfirmPopup';
import GeneralConfirm from 'components/GeneralConfirm';
import Tabs from 'components/Tabs';

// Utils import
import { getOrdersByUserId } from 'features/user/orderSlice';
import { orderStatusList } from 'utils/constants';
import { SocketContext } from 'index';

// Icons import
import { FaEdit, FaEye, FaTrashAlt } from 'react-icons/fa';
import { BsSearch } from 'react-icons/bs'
import { BiPencil } from 'react-icons/bi'
import { MdMoreVert } from 'react-icons/md';
import { IoMdAdd, IoMdClose } from 'react-icons/io';

// Css import
import styles from './Sender.module.scss'

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
	const [emptyAddressInfo, setEmptyAddressInfo] = useState(false);
	const [showMobileSearch, setShowMobileSearch] = useState(false);
	const [orderId, setOrderId] = useState('');
	const dispatch = useDispatch();
	const navigate = useNavigate();
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
		else if (order.status === 'cancel') {
			socket.emit('deleteOrder', {
				order_id: order._id
			})
			toast.success('Xóa đơn hàng thành công')
		}
		else {
			toast.warning('Đơn hàng đã được nhận, không thể xóa')
		}
	}

	function handleUpdateInfo() {
		setEmptyAddressInfo(false);
		navigate('/profile?tab=address');
	}

	function findOrderStatusCount(status) {
		return orders.reduce((acc, cur) => cur.status === status ? acc + 1 : acc, 0);
	}

	function setTabByWidget(status) {
		setSelectedTab(tabs.find(tab => tab.field === status));
	}

	const handleSearch = e => {
		if (e.keyCode === 13) {
			dispatch(getOrdersByUserId({userId: user.id, orderId}))
		}
	}

	useEffect(() => {
		if (!user?.area_code) {
			setEmptyAddressInfo(true);
		}
	}, [user])

	useEffect(() => {
		dispatch(getOrdersByUserId({userId: user.id}))
	}, [dispatch, user.id])

	useEffect(() => {
		setUpdatedOrders(orders)
	}, [orders])

	useEffect(() => {
		socket.on('updateOrderStatus', (data) => {
			console.log('updatedorder', updatedOrders)
			const { order_id, status, date } = data;
			setUpdatedOrders((prevOrders) => {
				const tempOrders = JSON.parse(JSON.stringify(prevOrders))
				tempOrders.forEach((order) => {
					if (order._id === order_id) {
						order.status = status
						order.tracking[status] = date;
					}
				})
				return tempOrders
			})
		});
		socket.on('deleteOrder', (data) => {
			const { order_id } = data;
			const tempOrders = updatedOrders.filter((item) => item._id !== order_id);
			setUpdatedOrders(tempOrders)
		});
		socket.on("connect_error", (err) => {
			console.log(`connect_error due to ${err.message}`);
		});
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
		<div className='h-100 d-flex flex-column'>
			{/* Header bar */}
			<div className='d-none d-sm-flex'>
				<div className={styles.searchBar}>
					<BsSearch />
					<input type="text" placeholder='Nhập mã đơn hàng' className='ms-3 w-100' value={orderId} onChange={e => setOrderId(e.target.value)} onKeyUp={handleSearch}/>
				</div>
				<Link className='btn fs-6' to="/create-order">
					<BiPencil className='me-3'/> Tạo đơn hàng
				</Link>
			</div>

			<div className='d-flex d-sm-none mobile-actions'>
				{showMobileSearch 
					? (<div className="search-bar-wrapper">
							<div className="search-bar">
								<input type="text" placeholder='Nhập mã đơn hàng' className='w-100 fs-14' />
								<div className="search-icon"><BsSearch /></div>
							</div>
							<div className="action-btn ms-1" onClick={() => setShowMobileSearch(false)}>
								<IoMdClose />
							</div>
						</div>)
					: (<div className='action-btn' onClick={() => setShowMobileSearch(true)}>
							<BsSearch />
						</div>)
				}
				<Link className='action-btn primary ms-2' to="/create-order">
					<IoMdAdd />
				</Link>
			</div>

			{/* General */}
			<div className='mb-3'>
				<h2 className='pt-sm-4 pb-3 fs-5'>Tổng quan</h2>
				<div className={styles.filterWrapper}>
					<div className={`${styles.orderFilter} ${styles.waiting}`}
						onClick={() => setTabByWidget('waiting')}>
						<span className={styles.count}>{findOrderStatusCount('waiting')}</span>
						<span>Đang xử lí</span>
					</div>

					<div className={`${styles.orderFilter} ${styles.accepted}`}
						onClick={() => setTabByWidget('accepted')}>
						<span className={styles.count}>{findOrderStatusCount('accepted')}</span>
						<span>Đã chấp nhận</span>
					</div>

					<div className={`${styles.orderFilter} ${styles.picked}`}
						onClick={() => setTabByWidget('picked')}>
						<span className={styles.count}>{findOrderStatusCount('picked')}</span>
						<span>Đã lấy hàng</span>
					</div>

					<div className={`${styles.orderFilter} ${styles.delivering}`}
						onClick={() => setTabByWidget('delivering')}>
						<span className={styles.count}>{findOrderStatusCount('delivering')}</span>
						<span>Đang giao hàng</span>
					</div>

					<div className={`${styles.orderFilter} ${styles.success}`}
						onClick={() => setTabByWidget('success')}>
						<span className={styles.count}>{findOrderStatusCount('success')}</span>
						<span>Giao thành công</span>
					</div>
					
					{/* <div className={`${styles.orderFilter} ${styles.orderFilter1}`}>
						<span className='font-weight-bold fs-1'>{updatedOrders.filter((order) => order.status !== 'waiting' && order.status !== 'accepted').length}</span>
						<span>Đã lấy hàng</span>
					</div>

					<div className={`${styles.orderFilter} ${styles.orderFilter2}`}>
						<span className='font-weight-bold fs-1'>{updatedOrders.filter((order) => order.status === 'waiting' || order.status === 'accepted').length}</span>
						<span>Chưa lấy hàng</span>
					</div> */}

				</div>
			</div>

			<h2 className='pt-sm-4 pb-3 fs-5'>Danh sách đơn hàng</h2>
			<Tabs tabs={tabs} changeTab={setSelectedTab} selectedTab={selectedTab} />

			{/* Order List */}
			{
				ordersByStatus.length === 0 
				? <p className='fs-3 text-center'> Không tìm thấy đơn hàng phù hợp </p>
				:
				<div className={styles.orderList}>
					{
						ordersByStatus.map((order) => (
							<div key={order._id} className={styles.order}>
								<ul className={`d-none d-sm-block ${styles.orderIcons}`}>
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

								<div className={`d-block d-sm-none dropdown-wrapper ${styles.orderIcons}`}>
									<button className='dropdown-toggle-btn' data-bs-toggle="dropdown" aria-expanded="false">
										<MdMoreVert />
									</button>
									<ul className="dropdown-menu">
										<li onClick={() => {
											setShowSpecificOrder(true);
											setSpecificOrder(order);
										}}>
											<a className="dropdown-item">
												<FaEye />
												<span className='ms-2'>Theo dõi</span>
											</a>
										</li>
										<li><a className="dropdown-item">
											<FaEdit />
											<span className='ms-2'>Chỉnh sửa</span>
										</a></li>
										<li onClick={() => {
											setToggleDeletePopup(true);
											setSpecificOrder(order);
										}}>
											<a className="dropdown-item">
												<FaTrashAlt />
												<span className='ms-2'>Xóa</span>
											</a>
										</li>
									</ul>
								</div>
								<div className={styles.orderInfo}>
									<div>
										<p className={styles.orderTitles}>Mã đơn hàng</p>
										<span>{order._id}</span>
									</div>
									<div><p className={styles.orderTitles}>Thời gian tạo</p> {moment(order.createdAt).format('DD-MM-YYYY HH:mm:ss')} </div>
									<div><p className={styles.orderTitles}>Phí vận chuyển</p> {order.shipping_fee}đ</div>
									<div>
										<p className={styles.orderTitles}>Trạng thái</p> 
										<div className={`${styles.orderTitlesStatus} ${order.status === 'waiting' ? styles.orderTitlesStatusYellow : order.status === 'cancel' ? styles.orderTitlesStatusRed : styles.orderTitlesStatusGreen}`}>{orderStatusList[order.status === 'on_vehicle' ? 'import' : order.status]}</div>
									</div>
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
												<p key={item._id} className={styles.item} > {item.name} </p>
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

			{emptyAddressInfo && (
				<GeneralConfirm 
					title="Cảm ơn bạn đã lựa chọn BK Delivery"
					message="Để tiếp tục sử dụng dịch vụ, vui lòng cập nhật địa chỉ của bạn. Chúng tôi cần thông tin địa chỉ chính xác để đảm bảo giao dịch diễn ra thuận lợi. Xin cảm ơn!"
					disableCancel={true}
					showConfirmButton={true}
					confirmText="Đồng ý"
					onConfirm={handleUpdateInfo}

				/>
			)}

		</div>
	)
}

export default SenderHome