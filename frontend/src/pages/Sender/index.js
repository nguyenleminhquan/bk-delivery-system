import { testJWT } from 'features/user/userSlice';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import customFetch from 'services/axios'

function Sender() {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(testJWT())
	}, [])

	return (
		<h1>Sender</h1>
	)
}

export default Sender