import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { personalTabFields } from 'utils/constants'
import { toast } from 'react-toastify'
import FormInput from 'components/FormInput';

function PersonalTab() {
	const { user } = useSelector((state) => state.user);
	const [userData, setUserData] = useState({
		fullname: user?.fullname,
		email: user?.email || '',
		phone: user?.phone || '',
	})

	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setUserData({ ...userData, [name]: value });
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		const { fullname, email, phone } = userData;
		if (!fullname || !email || !phone) {
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
			<h4 className='title'>Thông tin cá nhân</h4>
			<form>
				{
					personalTabFields(userData).map((item) =>
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
				<button className='btn' onClick={handleSubmit}>Cập nhật</button>
			</form>
		</div>
	)
}

export default PersonalTab