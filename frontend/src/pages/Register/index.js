import FormInput from 'components/FormInput'
import OuterTemplate from 'components/OuterTemplate'
import { registerUser } from 'features/user/userSlice';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { registerFields } from 'utils/constants';
import { toast } from 'react-toastify';
import './index.scss'
import { useDispatch, useSelector } from 'react-redux';

const initialState = {
	fullname: '',
	email: '',
	phone: '',
	password: '',
	passwordc: ''
}

function Register() {
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
		const { fullname, email, phone, password, passwordc } = values;
		if (!fullname || !email || !phone || !password || !passwordc) {
			toast.error('Please fill out all fields');
      		return;
		};
		if (password !== passwordc) {
			toast.error('Confirm password not match');
      		return;
		}
		dispatch(registerUser(
		{
			fullname: fullname,
			email: email, 
			phone: phone,
			password: password,
			typeUser: 'sender'
		}));
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
			<div className='register'>
				<h2>Tạo tài khoản</h2>
				<form>
					{
						registerFields(values).map((item) =>
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
					<button className='btn login-btn' onClick={handleSubmit}>Đăng ký</button>
				</form>
				<p className='clue'>
					Bạn đã có tài khoản?
					<Link to='/login'>Đăng nhập</Link>
				</p>
			</div>
		</OuterTemplate>
	)
}

export default Register