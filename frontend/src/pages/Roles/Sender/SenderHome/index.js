import { BsSearch } from 'react-icons/bs'
import { BiPencil } from 'react-icons/bi'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
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
				<button className='btn fs-4'>
					<BiPencil className='me-3' /> Tạo đơn hàng
				</button>
			</div>

			{/* General */}
			<div>
				<h1 className='pt-5 pb-3'>Tổng quan</h1>
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