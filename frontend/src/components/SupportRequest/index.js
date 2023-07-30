import FormInput from 'components/FormInput'
import React, { useState } from 'react'
import { FaFirstOrder } from 'react-icons/fa'
import './index.scss'
const initialValues = {
    id: '',
    problem: ''
}

function SupportRequest() {
    const [values, setValues] = useState(initialValues)

    const handleChange = (e) => {
		e.preventDefault()
		const name = e.target.name;
		const value = e.target.value;
		setValues({ ...values, [name]: value });
	}

    return (
        <div className='support-request'>
            <h5>Yêu cầu xử lí</h5>
            <div>
                <p>Mã đơn hàng</p>
                <FormInput
                    type='text'
                    name='id'
                    placeholderText='Nhập mã đơn hàng cần xử lí'
                    value={values.id }
                    handleChange={handleChange}
                    icon={<FaFirstOrder />}
                />
            </div>
            <div>
                <p>Vấn đề phát sinh</p>
                <textarea></textarea>
            </div>
            <button className='btn btn-medium'>Gửi yêu cầu</button>
        </div>
    )
}

export default SupportRequest