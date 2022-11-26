import FormInput from 'components/FormInput'
import OuterTemplate from 'components/OuterTemplate'
import { loginUser } from 'features/user/userSlice';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginFields } from 'utils/constants';
import { toast } from 'react-toastify'
import './index.scss'

const initialState = {
	email: '',
	password: ''
}

function Login() {
	const [values, setValues] = useState(initialState);
	const { user, isLoading } = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setValues({ ...values, [name]: value });
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		const { email, password } = values;
		if (!email || !password) {
			toast.error('Please fill out all fields');
      		return;
		}
		dispatch(loginUser({ email: email, password: password }))
	}
	
	useEffect(() => {
		if (user) {
		setTimeout(() => {
			navigate('/');
		}, 2000);
		}
	}, [user]);

	return (
		<OuterTemplate>
			<div className='login'>
				<h2>Đăng nhập</h2>
				<form>
					{
						loginFields(values).map((item) =>
							<FormInput
								key={item.id}
								type={item.type}
								name={item.name}
								placeholderText={item.placeholderText}
								value={item.value}
								handleChange={handleChange}
								icon={item.icon}
							/>
						)
					}
					<button className='btn login-btn' onClick={handleSubmit}>Đăng nhập</button>
				</form>
				<Link to='/forgot-password' className='forget-pass'>Quên mật khẩu?</Link>
				<p className='clue'>
					Bạn chưa có tài khoản?
					<Link to='/register'>Đăng ký</Link>
				</p>
			</div>
		</OuterTemplate>
	)
}

export default Login