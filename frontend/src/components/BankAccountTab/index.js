import FormInput from 'components/FormInput';
import FormSelect from 'components/FormSelect';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify'
import { bankList } from 'utils/constants';
import { AiFillBank } from 'react-icons/ai'
import { FaAddressCard } from 'react-icons/fa'

function BankAccountTab() {
	const { user } = useSelector((state) => state.user);
	const [values, setValues] = useState({
		bankName: '',
		owner: '',
		accNum: '',
	})

	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setValues({ ...values, [name]: value });
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		const { bankName, owner, accNum } = values;
		if (!bankName || !owner || !accNum) {
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
			<h4 className='title'>Tài khoản ngân hàng</h4>
			<form>
				<FormSelect
					name='bankName'
					value={values.bankName}
					handleChange={handleChange}
					labelText='Tên ngân hàng'
					list={bankList}
					icon={<AiFillBank />}
				/>
				<FormInput
					type='text'
					name='owner'
					placeholderText='Nhập chủ tài khoản'
					value={values.owner}
					handleChange={handleChange}
					labelText='Chủ tài khoản'
					icon={<FaAddressCard />}
				/>
				<FormInput
					type='number'
					name='accNum'
					placeholderText='Nhập số tài khoản'
					value={values.accNum}
					handleChange={handleChange}
					labelText='Số tài khoản'
					icon={<FaAddressCard />}
				/>
				<button className='btn' onClick={handleSubmit}>Cập nhật</button>
			</form>
		</div>
	)
}

export default BankAccountTab