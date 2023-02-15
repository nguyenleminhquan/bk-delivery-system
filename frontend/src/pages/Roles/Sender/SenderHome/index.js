import { BsSearch } from 'react-icons/bs'
import { BiPencil } from 'react-icons/bi'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom';
import styles from './Sender.module.scss'

function SenderHome() {
	const dispatch = useDispatch();

	return (
		<div className={styles.wrapper}>
			{/* Header bar */}
			<div className='d-flex'>
				<div className={styles.searchBar}>
					<BsSearch />
					<input type="text" placeholder='Nhập mã đơn hàng' className='ms-5' />
				</div>
				<Link className='btn fs-4' to="/create-order">
					<BiPencil className='me-3'/> Tạo đơn hàng
				</Link>
			</div>

			{/* General */}
			<div>
				<h2 className='pt-5 pb-3 fs-1'>Tổng quan</h2>
				{/* Đã lấy hàng filter */}
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
			<div>
				<ul className={styles.orderSubFilter} role="button">
					<li className={styles.active}>Đang xử lí</li>
					<li>Đang giao</li>
					<li>Chờ xác nhận lại</li>
					<li>Trả hàng</li>
				</ul>

				{/* Order block */}
				<div>

				</div>
			</div>
		</div>
	)
}

export default SenderHome