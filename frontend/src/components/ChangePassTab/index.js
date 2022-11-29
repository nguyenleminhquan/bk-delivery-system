import FormInput from 'components/FormInput';
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { changePassTabFields } from 'utils/constants';

function ChangePassTab() {
	const [values, setValues] = useState({
		oldPass: '',
		newPass: '',
		newPassc: ''
	})

	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setValues({ ...values, [name]: value });
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		const { oldPass, newPass, newPassc } = values;
		if (!oldPass || !newPass || !newPassc) {
			toast.error('Please fill out all fields');
			return;
		};
		// dispatch(registerUser(
		// {
		// 	fullname: fullname,
		// 	email: email, 
		// 	phone: phone,
		// 	password: password,
		// 	typeUser: 'sender'
		// }));
	}

	return (
		<div className='personal-tab'>
			<h4 className='title'>Đổi mật khẩu</h4>
			<form>
				{
					changePassTabFields(values).map((item) =>
						<FormInput
							key={item.id}
							type={item.type}
							name={item.name}
							placeholderText={item.placeholderText}
							value={item.value}
							handleChange={handleChange}
							icon={item.icon}
							labelText={item.label}
						/>
					)
				}
				<button className='btn' onClick={handleSubmit}>Đổi mật khẩu</button>
			</form>
		</div>
	)
}

export default ChangePassTab