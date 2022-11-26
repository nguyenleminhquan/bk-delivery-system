import { clearStore, testJWT } from 'features/user/userSlice';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

function Sender() {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(testJWT())
	}, [])

	return (
		<>
		<h1>Sender</h1>
		<button onClick={() => dispatch(clearStore('Logging out...'))}>Logout</button>
		</>
	)
}

export default Sender