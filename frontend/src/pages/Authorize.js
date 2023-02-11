import React from 'react'
import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import Profile from './Profile';
import AdminHome from './Roles/Admin/AdminHome';
import DriverHome from './Roles/Driver/DriverHome';
import SenderHome from './Roles/Sender/SenderHome';
import StockerHome from './Roles/Stocker/StockerHome';

function Authorize() {
	const { user } = useSelector((state) => state.user);

	if (user.typeUser === 'sender') {
		return (
			<Routes>
				<Route index element={<SenderHome />}></Route>
				<Route path='/profile' element={<Profile />}></Route>
			</Routes>
		)
	}

	if (user.typeUser === 'driver') {
		return (
			<Routes>
				<Route index element={<DriverHome />}></Route>
				<Route path='/profile' element={<Profile />}></Route>
			</Routes>
		)
	}

	if (user.typeUser === 'stocker') {
		return (
			<Routes>
				<Route index element={<StockerHome />}></Route>
				<Route path='/profile' element={<Profile />}></Route>
			</Routes>
		)
	}

	if (user.typeUser === 'admin') {
		return (
			<Routes>
				<Route index element={<AdminHome />}></Route>
				{/* <Route path='/profile' element={<Profile />}></Route> */}
			</Routes>
		)
	}

	//   return (
	//     <div>Authorize</div>
	//   )
}

export default Authorize