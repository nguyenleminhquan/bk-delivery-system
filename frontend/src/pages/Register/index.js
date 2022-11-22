import FormInput from 'components/FormInput'
import OuterTemplate from 'components/OuterTemplate'
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { registerFields } from 'utils/constants';
import './index.scss'

const initialState = {
	fullname: '',
	email: '',
	phone: '',
	password: '',
	passwordc: ''
}

function Register() {
	const [values, setValues] = useState(initialState);

	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setValues({ ...values, [name]: value });
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		const { fullname, email, phone, password } = values;
		if (!fullname || !email || !phone || !password) return;
		// dispatch(loginUser({email: email, password: password}));
	}

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