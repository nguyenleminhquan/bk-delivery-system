import Sidebar from 'components/Sidebar';
import { clearStore, testJWT } from 'features/user/userSlice';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Profile from 'pages/Profile';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import styles from './Sender.module.scss'

function Sender() {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(testJWT())
	}, [])

	return (
		<div className='wrapper'>
			
		</div>
	)
}

export default Sender