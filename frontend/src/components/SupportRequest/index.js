import FormInput from 'components/FormInput'
import React, { useContext, useState } from 'react'
import { FaFirstOrder } from 'react-icons/fa'
import './index.scss'
import { useDispatch, useSelector } from 'react-redux'
import { SocketContext } from 'index'
import { toast } from 'react-toastify'
const initialValues = {
    order_id: '',
    content: ''
}

function SupportRequest() {
    const [values, setValues] = useState(initialValues)
    const dispatch = useDispatch();
    const socket = useContext(SocketContext);
    const { user } = useSelector((state) => state.user);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('values', values)
        console.log('user', user)
        let typeUser;
        switch(user.typeUser) {
            case 'sender':
                typeUser = 'Khách hàng'
                break
            case 'stocker':
                typeUser = 'Thủ kho'
                break
            case 'driver_inner':
                typeUser = 'Tài xế'
                break
            case 'driver_inter':
                typeUser = 'Tài xế'
                break
        }
        socket.emit('newSupportRequest', {
            requester: typeUser + ' ' + user.fullname,
            order: values.order_id,
            content: values.content  
        })
        setValues(initialValues);
        toast.success('Tạo yêu cầu thành công')
    }

    const handleChange = (e) => {
		e.preventDefault()
		const name = e.target.name;
		const value = e.target.value;
		setValues({ ...values, [name]: value });
	}

    return (
        <div className='support-request'>
            <h5 className='d-none d-sm-block'>Yêu cầu xử lí</h5>
            <div>
                <p>Mã đơn hàng</p>
                <FormInput
                    type='text'
                    name='order_id'
                    placeholderText='Nhập mã đơn hàng cần xử lí'
                    value={values.order_id }
                    handleChange={handleChange}
                    icon={<FaFirstOrder />}
                />
            </div>
            <div>
                <p>Vấn đề phát sinh</p>
                <textarea value={values.content} name='content' onChange={handleChange}></textarea>
            </div>
            <button className='btn btn-medium' onClick={handleSubmit}>Gửi yêu cầu</button>
        </div>
    )
}

export default SupportRequest