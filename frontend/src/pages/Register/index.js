import React, { useEffect, useLayoutEffect, useState } from 'react'
import FormInput from 'components/FormInput'
import OuterTemplate from 'components/OuterTemplate'
import { registerUser } from 'features/user/userSlice';
import { Link, useNavigate } from 'react-router-dom';
import { registerFields } from 'utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { validateForm, isErrorMsgEmpty } from 'utils/validate';
import './index.scss'

const initialState = {
	fullname: '',
	email: '',
	phone: '',
	password: '',
	passwordc: ''
}

function Register() {
	const initErrorMsg = () => {
		return registerFields(values).map(item => ({name: item.name, msg: ''}));
	}
	const [values, setValues] = useState(initialState);
	const { user, isLoading } = useSelector((state) => state.user);
	const [formData, setFormData] = useState({});
	// State for validate input
	const [errorMsg, setErrorMsg] = useState(initErrorMsg);
	const [emptyField, setEmptyField] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleChange = (e) => {
		setSubmitted(false);
		setEmptyField(false);
		const name = e.target.name;
		const value = e.target.value;
		setValues({ ...values, [name]: value });
		setErrorMsg(initErrorMsg);
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		const { fullname, email, phone, password, passwordc } = values;
		setSubmitted(true);
		setFormData(values);
		if (!fullname || !email || !phone || !password || !passwordc) {
			setEmptyField(true);
      		return;
		};
		validateForm(values, setErrorMsg);
	}

	useLayoutEffect(() => {
		if (isErrorMsgEmpty(errorMsg) && submitted) {
			dispatch(registerUser({
				fullname: formData?.fullname,
				email: formData?.email, 
				phone: formData?.phone,
				password: formData?.password,
				typeUser: 'sender'
			}));
			console.log(formData);
		}
	}, [submitted])

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
				<h2 className='mt-5'>Tạo tài khoản</h2>
				<span className="error-msg">{emptyField && 'Please fill out all fields'}</span>
				<form>
					{
						registerFields(values).map((item, index) =>
							<FormInput
								key={item.id}
								type={item.type}
								name={item.name}
								placeholderText={item.placeholderText}
								value={item.value}
								handleChange={handleChange}
								icon={item.icon}
								errorMsg={errorMsg[index].msg}
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