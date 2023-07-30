import FormInput from 'components/FormInput'
import FormSelect from 'components/FormSelect'
import React from 'react'
import './index.scss'
import { FaFirstOrder, FaTruck, FaWarehouse } from 'react-icons/fa'

const stockList = [
    'Kho Tân Phú Tp.HCM',
    'Kho Thủ Đức Tp.HCM'
]
const deliveryTypeList = [
    {
        id: 'inner_sender',
        text: 'Vận chuyển nội thành từ người gửi'
    },
    {
        id: 'inter',
        text: 'Vận chuyển liên tỉnh'
    },
    {
        id: 'inner_receiver',
        text: 'Vận chuyển nội thành đến người nhận'
    },
]

const vehicleList = [
    '640812a1db5e1e0f4c6babfb - 800kg/1000kg'
]

function AdminOrderManagement() {
  return (
    <div className='admin-order-management'>
        <h2 className='fs-5 pb-3'>Quản lý đơn hàng</h2>
        <div className='form-wrapper'>
            <h5 className='title'>Gán đơn hàng cho tài xế vận chuyển</h5>
            <FormInput
                type='text'
                name='id'
                placeholderText='Nhập mã đơn hàng'
                // value={values.id }
                // handleChange={handleChange}
                icon={<FaFirstOrder />}
                labelText='Mã đơn hàng'
            />
            <FormSelect
                name='stock'
                // value={values.bankName}
                // handleChange={handleChange}
                labelText='Kho hoạt động'
                list={stockList}
                icon={<FaWarehouse />}
            />
            <FormSelect
                name='deliveryType'
                // value={values.bankName}
                // handleChange={handleChange}
                labelText='Loại hình vận chuyển'
                list={deliveryTypeList.map((item) => item.text)}
                icon={<FaTruck />}
            />
            <FormSelect
                name='vehicle'
                // value={values.bankName}
                // handleChange={handleChange}
                labelText='Chọn mã xe tải vận chuyển đơn hàng'
                list={vehicleList}
                icon={<FaTruck />}
            />
            <button className='btn btn-medium'>Gửi yêu cầu</button>
        </div>
    </div>
  )
}

export default AdminOrderManagement