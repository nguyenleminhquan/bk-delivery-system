import Table from 'components/Table'
import { getDeliveryHistory } from 'features/delivery/deliverySlice'
import React, { useEffect, useState } from 'react'
import { BsCalendarEvent } from 'react-icons/bs'
import { FaUser } from 'react-icons/fa'
import { MdLocationOn } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import './index.scss'


function DriverHistory() {
	const { deliveries } = useSelector((state) => state.delivery)
	const { user } = useSelector((state) => state.user)
	const [rowData, setRowData] = useState([]);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getDeliveryHistory(user.id))
	}, [dispatch, user.id])

	useEffect(() => {
		console.log('deliveries', deliveries)
		let deliveryArray = JSON.parse(JSON.stringify(deliveries));
		let deliveryData = [];
		deliveryArray.map((item, index) => {
			let row = {};
			row.id = (
				<div>
					<p>ID vận chuyển: {item._id}</p>
					<p>ID đơn hàng: {item.order._id}</p>
					<p>
						<BsCalendarEvent />
						{ item.updatedAt && new Date(item.updatedAt).getDate() + '/' + new Date(item.updatedAt).getMonth() + '/' + new Date(item.updatedAt).getFullYear() }
					</p>
				</div>
			);
			row.picked = (
				<div>
					<p>
						<FaUser />
						{ item.from?.split('&')[0] }
					</p>
					<p>
						<MdLocationOn />
						{ item.from?.split('&')[1] }
					</p>
				</div>
			);
			row.deliveried = (
				<div>
					<p>
						<FaUser />
						{ item.to?.split('&')[0] }
					</p>
					<p>
						<MdLocationOn />
						{ item.to?.split('&')[1] }
					</p>
				</div>
			);
			row.items = (
				<ul>
					{item.order.items.map((elem, index) => <li key={index}> {index + 1}. {elem.name} </li>)}
				</ul>
			)
			deliveryData.push(row)
		})
		setRowData(deliveryData)
	}, [deliveries])

	const data = {
		columns: [
			{
				label: 'Id',
				field: 'id',
				sort: 'asc',
				width: 150
			},
			{
				label: 'Lấy',
				field: 'picked',
				sort: 'asc',
				width: 270
			},
			{
				label: 'Giao',
				field: 'deliveried',
				sort: 'asc',
				width: 270
			},
			{
				label: 'Sản phẩm',
				field: 'items',
				sort: 'asc',
				width: 150
			},
		],
		rows: rowData
	}

	return (
		<div className='driver-history'>
			<h2 className='fs-5 pb-3 d-none d-sm-block'>Lịch sử giao nhận</h2>
			<Table data={data} />
		</div>
	)
}

export default DriverHistory