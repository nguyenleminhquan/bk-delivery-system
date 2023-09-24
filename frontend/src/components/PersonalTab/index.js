import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { personalTabFields } from 'utils/constants'
import { toast } from 'react-toastify'
import FormInput from 'components/FormInput';
import { updateUser } from 'features/user/userSlice';

function PersonalTab() {
	const { user } = useSelector((state) => state.user);
	const [values, setValues] = useState({
		fullname: user?.fullname || '',
		email: user?.email || '',
		phone: user?.phone || '',
	})
	const dispatch = useDispatch();

	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setValues({ ...values, [name]: value });
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		const { fullname, email, phone } = values;
		if (!fullname || !email || !phone) {
			toast.error('Please fill out all fields');
			return;
		};
		dispatch(updateUser(
			{
				userId: user.id,
				info: {
					fullname: values.fullname,
					email: values.email,
					phone: values.phone
				}
			}
		))
	}

	return (
		<div className='personal-tab'>
			<h4 className='title'>Thông tin cá nhân</h4>
			<form>
				{
					personalTabFields(values).map((item) =>
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
				<div className='text-end'>
					<button className='btn' onClick={handleSubmit}>Cập nhật</button>
				</div>
			</form>
		</div>
	)
}

export default PersonalTab