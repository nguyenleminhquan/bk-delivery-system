import { testJWT } from 'features/user/userSlice';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
	const { user } = useSelector((state) => state.user);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(testJWT(user))
	}, [dispatch])

	if (!user) {
		return <Navigate to='/landing' />
	}
  	return children
}

export default ProtectedRoute