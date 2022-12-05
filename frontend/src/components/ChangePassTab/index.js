import FormInput from 'components/FormInput';
import { changePassword } from 'features/user/userSlice';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify'
import { changePassTabFields } from 'utils/constants';

function ChangePassTab() {
	const { user } = useSelector((state) => state.user);
	const [values, setValues] = useState({
		oldPass: '',
		newPass: '',
		newPassc: ''
	})
	const dispatch = useDispatch();

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
		if (newPass != newPassc) {
			toast.error('Confirm password not match');
      		return;
		}
		dispatch(changePassword(
			{
				userId: user.id,
				oldPass: oldPass,
				newPass: newPass
			}
		))
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