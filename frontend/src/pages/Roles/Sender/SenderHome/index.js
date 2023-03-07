import { BsSearch } from 'react-icons/bs'
import { BiPencil } from 'react-icons/bi'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import styles from './Sender.module.scss'
import Table from 'components/Table';
import { getOrdersByUserId } from 'features/user/orderSlice';
import { FaEdit, FaEye, FaTrashAlt } from 'react-icons/fa';
import { orderStatusList } from 'utils/constants';
import SpecificSenderOrder from 'components/SpecificSenderOrder';

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
	  	field: 'picking',
	  	name: 'Đơn được gán',
	},
	{
	  	field: 'accepted',
	  	name: 'Đã nhận đơn',
	},
	{
	  	field: 'picked',
	  	name: 'Đã lấy hàng',
	}
  ]

function SenderHome() {
	const { user } = useSelector((state) => state.user);
	const { orders } = useSelector((state) => state.order);
	const [configOrders, setConfigOrders] = useState([]);
	const [showSpecificOrder, setShowSpecificOrder] = useState(false);
	const [specificOrder, setSpecificOrder]= useState('');
	const [selectedTab, setSelectedTab] = useState(tabs[0]);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getOrdersByUserId(user.id))
	}, [dispatch, user.id])

	useEffect(() => {
		if (selectedTab.field === 'all') {
			setConfigOrders(orders)
		}
		else {
			setConfigOrders(orders.filter((order) => order.status === selectedTab.field))
		}
	}, [selectedTab])

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
				<h2 className='pt-5 pb-3 fs-3'>Tổng quan</h2>
				<div className="filter d-flex align-items-center">
					<div className={`${styles.orderFilter} ${styles.orderFilterActive}`}>
						<p className='font-weight-bold fs-1'>2</p>
						<p>Đã lấy hàng</p>
					</div>

					<div className={styles.orderFilter}>
						<p className='font-weight-bold fs-1'>1</p>
						<p>Chưa lấy hàng</p>
					</div>

				</div>
			</div>

			<ul className={styles.tabHeader}>
				{tabs.map(tab => (
				<li key={tab.name} 
					className={selectedTab.field === tab.field ? `${styles.tabHeaderItem} ${styles.active}` : `${styles.tabHeaderItem}`}
					onClick={() => setSelectedTab(tab)}
				>{tab.name}</li>
				))}
			</ul>

			{/* Table */}
			{/* <div className='mt-20'>
				<Table data={data} />
			</div> */}
			<div className={styles.orderList}>
				{
					configOrders.map((order) => (
						<div key={order._id} className={styles.order}>
							<div className={styles.orderInfo}>
								<div><p className='fw-bold mb-0'>Mã đơn hàng:</p> {order._id}</div>
								<div><p className='fw-bold mb-0'>Thời gian tạo:</p> </div>
								<div><p className='fw-bold mb-0'>Phí vận chuyển:</p> {order.shipping_fee}đ</div>
								<div><p className='fw-bold mb-0'>Trạng thái:</p> {order.status}</div>
							</div>
							<div className=''>
								<p className='fw-bold mb-0'>Địa chỉ người nhận:</p> 
								<p> {order.receiver_address} </p>
							</div>
							<div>
								<p className='fw-bold mb-1'>Sản phẩm:</p>
								<div className={styles.itemList}>
									{
										order.items.map((item) => (
											<p key={item._id} className={styles.item} > {item.name} </p>
										))
									}
								</div>
							</div>
							<div className={styles.iconList}>
								<FaEye className='text-success' onClick={() => {
									setShowSpecificOrder(true)
									setSpecificOrder(order)
								}} />
								<FaEdit className='text-primary' />
								<FaTrashAlt className='text-danger' />
							</div>
						</div>
					))
				}
			</div>

			{
				showSpecificOrder && <SpecificSenderOrder order={specificOrder} closeModal={() => setShowSpecificOrder(false)} />
			}

		</div>
	)
}

export default SenderHome