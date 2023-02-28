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

function SenderHome() {
	const { user } = useSelector((state) => state.user);
	const { orders } = useSelector((state) => state.order);
	const [rowData, setRowData] = useState([]);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getOrdersByUserId(user.id))
	}, [dispatch, user.id])

	useEffect(() => {
		let orderArray = JSON.parse(JSON.stringify(orders));
		let orderData = [];
		orderArray.map((item, index) => {
			let row = {};
			row.id = item._id;
			row.receiver = 'Nguyễn Văn A'
			row.fee = item.shipping_fee + 'đ';
			row.createdTime = item.createdAt;
			row.status = orderStatusList[item.status]
			row.btns = (
				<div>
					<FaEye />
					<FaEdit className='edit-btn' />
					<FaTrashAlt className='delete-btn' />
				</div>
			)
			orderData.push(row)
		})
		setRowData(orderData)
	}, [orders])

	const data = {
		columns: [
			{
				label: 'Mã đơn hàng',
				field: 'id',
				sort: 'asc',
				width: 200
			},
			{
				label: 'Người nhận',
				field: 'receiver',
				sort: 'asc',
				width: 200
			},
			{
				label: 'Tổng phí',
				field: 'fee',
				sort: 'asc',
				width: 200
			},
			{
				label: 'Ngày tạo',
				field: 'createdTime',
				sort: 'asc',
				width: 200
			},
			{
				label: 'Trạng thái',
				field: 'status',
				sort: 'asc',
				width: 200
			},
			{
				label: '',
				field: 'btns',
				sort: 'asc',
				width: 200
			},
		],
		rows: rowData
	}

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

			{/* Table */}
			<div className='mt-20'>
				<Table data={data} />
			</div>

		</div>
	)
}

export default SenderHome