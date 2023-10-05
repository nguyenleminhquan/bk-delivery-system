import React from 'react'
import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import Profile from './Profile';
import AdminHome from './Roles/Admin/AdminHome';
import DriverHome from './Roles/Driver/DriverHome';
import SenderHome from './Roles/Sender/SenderHome';
import StockerHome from './Roles/Stocker/StockerHome';
import CreateOrder from './CreateOrder';
import ExportOrder from './ExportOrder';
import DriverHistory from './Roles/Driver/DriverHistory';
import LoadOrderToTruck from './LoadOrderToTruck';
import AdminEmployeeManagement from './Roles/Admin/AdminEmployeeManagement';
import AdminStockManagement from './Roles/Admin/AdminStockManagement';
import ImportExportHistory from './Roles/Stocker/ImportExportHistory';
import AdminVehicleManagement from './Roles/Admin/AdminVehicleManagement';
import SupportRequest from 'components/SupportRequest';
import ResolveSupportRequest from 'components/ResolveSupportRequest';
import AdminOrderManagement from './Roles/Admin/AdminOrderManagement';
import AdminCOD from './Roles/Admin/AdminCOD';

function Authorize() {
	const { user } = useSelector((state) => state.user);

	if (user.typeUser === 'sender') {
		return (
			<Routes>
				<Route index element={<SenderHome />}></Route>
				<Route path='/profile' element={<Profile />}></Route>
				<Route path='/cod' element={<AdminCOD />}></Route>
				<Route path='/create-order' element={<CreateOrder />}></Route>
				<Route path='/request' element={<SupportRequest />}></Route>
			</Routes>
		)
	}

	if (user.typeUser.includes('driver')) {
		return (
			<Routes>
				<Route index element={<DriverHome />}></Route>
				<Route path='/delivery-history' element={<DriverHistory />}></Route>
				<Route path='/profile' element={<Profile />}></Route>
				<Route path='/request' element={<SupportRequest />}></Route>
			</Routes>
		)
	}

	if (user.typeUser === 'stocker') {
		return (
			<Routes>
				<Route index element={<StockerHome />}></Route>
				<Route path='/profile' element={<Profile />}></Route>
				<Route path='/export-order' element={<ExportOrder />}></Route>
				<Route path='/load-order' element={<LoadOrderToTruck />}></Route>
				<Route path='/import-export-history' element={<ImportExportHistory />}></Route>
				<Route path='/request' element={<SupportRequest />}></Route>
			</Routes>
		)
	}

	if (user.typeUser === 'admin') {
		return (
			<Routes>
				<Route index element={<AdminHome />}></Route>
				<Route path='/cod' element={<AdminCOD />}></Route>
				<Route path='/employee-management' element={<AdminEmployeeManagement />}></Route>
				<Route path='/stock-management' element={<AdminStockManagement />}></Route>
				<Route path='/vehicle-management' element={<AdminVehicleManagement />}></Route>
				<Route path='/request' element={<ResolveSupportRequest />}></Route>
				<Route path='/order-management' element={<AdminOrderManagement />}></Route>
			</Routes>
		)
	}

	//   return (
	//     <div>Authorize</div>
	//   )
}

export default Authorize