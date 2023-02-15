import FormInput from 'components/FormInput'
import OuterTemplate from 'components/OuterTemplate'
import { loginUser } from 'features/user/userSlice';
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginFields } from 'utils/constants';
import './index.scss'
import { isErrorMsgEmpty, validateForm } from 'utils/validate';

const initialState = {
	email: '',
	password: ''
}

function Login() {
	const initErrorMsg = () => {
		return loginFields(values).map(item => ({name: item.name, msg: ''}));
	}
	const [values, setValues] = useState(initialState);
	const { user, isLoading } = useSelector((state) => state.user);
	// State for validate input
	const [submitted, setSubmitted] = useState(false);
	const [errorMsg, setErrorMsg] = useState(() => initErrorMsg(values));
	const [emptyField, setEmptyField] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleChange = (e) => {
		setEmptyField(false);
		setSubmitted(false);
		const name = e.target.name;
		const value = e.target.value;
		setValues({ ...values, [name]: value });
		setErrorMsg(initErrorMsg);
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		setSubmitted(true);
		if (!values.email || !values.password) {
			setEmptyField(true);
      		return;
		}
		validateForm(values, setErrorMsg);
	}

	useLayoutEffect(() => {
		if (isErrorMsgEmpty(errorMsg) && submitted) {
			dispatch(loginUser(values));
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
			<div className='login'>
				<h2>Đăng nhập</h2>
				<span className="error-msg">{emptyField && 'Please fill out all fields'}</span>
				<form>
					{
						loginFields(values).map((item, index) =>
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