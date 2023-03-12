import moment from 'moment'
import React from 'react'
import { FaCheck, FaTimes } from 'react-icons/fa'
import { orderStatusList } from 'utils/constants'
import './index.scss'

let orderTrackingStatusList = [
    {
        id: 1,
        status: 'waiting',
        desc: 'Đơn hàng đang được xử lý',
        date: '17/11/2022'
    },
    {
        id: 2,
        status: 'picking',
        desc: 'Đang lấy hàng',
        date: '17/11/2022'
    },
    {
        id: 3,
        status: 'picking_success',
        desc: 'Đã lấy hàng',
        date: '17/11/2022'
    },
    {
        id: 4,
        status: 'import',
        desc: 'Đã nhập kho',
        date: '17/11/2022'
    },
    {
        id: 5,
        status: 'transhipment',
        desc: 'Đang luân chuyển',
        date: '17/11/2022'
    },
]

function SpecificSenderOrder({ closeModal, order }) {
    const tracking = order.tracking ? order.tracking : {};
    
  return (
    <div className='specific-sender-order'>
        <div className='container'>
            <button className='close-btn' onClick={closeModal}> <FaTimes /> </button>
            <div className='delivery-info'>
                <p className='header'>Thông tin vận chuyển</p>
                <div className='box'>
                    <p>
                        <span>Mã vận đơn</span>
                        <span className='fw-bold'> {order._id} </span>
                    </p>
                    <div className='order-track'>
                        {
                            Object.entries(orderStatusList).map(([key, value]) => (
                                <div className={key in tracking ? 'order-track-step completed' : 'order-track-step'} key={key}>
                                    <div className='order-track-status'>
                                        <span className="order-track-status-dot">
                                            <FaCheck />
                                        </span>
                                        <span className="order-track-status-line"></span>
                                    </div>
                                    <div className="order-track-text">
                                        <p className="order-track-text-stat"> {value} </p>
                                        <span className="order-track-text-sub"> {key in tracking ? moment(tracking[key]).format('DD-MM-YYYY HH:mm:ss') : ''} </span>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className='order-info'>
                <p className='header'>Thông tin đơn hàng</p>
                <div className='user-info'>
                    <div className='user-info-grid'>
                        <p className='text-uppercase text-center'>Địa chỉ gửi</p>
                        <p className='text-uppercase text-center'>Địa chỉ nhận</p>
                        <p className='text-uppercase text-center'>Hình thức thanh toán</p>
                    </div>
                    <div className='user-info-grid'>
                        <div className='box'>
                            <p className='fw-bold'> {order.sender_name} </p>
                            <p> Địa chỉ: {order.sender_address} </p>
                            <p> Số điện thoại: {order.sender_phone} </p>
                        </div>
                        <div className='box'>
                            <p className='fw-bold'> {order.receiver_name} </p>
                            <p> Địa chỉ: {order.receiver_address} </p>
                            <p> Số điện thoại: {order.receiver_phone} </p>
                        </div>
                        <div className='box'>
                            <p className='fw-bold'>
                                Thanh toán tiền mặt khi nhận hàng - Người gửi
                            </p>
                        </div>
                    </div>
                </div>
                <table className='table'>
                        <thead>
                            <tr>
                                <td>Sản phẩm</td>
                                <td>Số lượng</td>
                                <td>Khối lượng</td>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map((item) => (
                                <tr key={item._id}>
                                    <td> {item.name} </td>
                                    <td> {item.quantity} </td>
                                    <td> {item.weight} kg </td>
                                </tr>
                            ))}
                        </tbody>
                </table>
                <div className='price-info'>
                    <div>
                        <p>Tạm tính:</p>
                        <p>Phí vận chuyển:</p>
                        <p className='total'>Tổng cộng:</p>
                    </div>
                    <div>
                        <p className='fw-bold'> {order.cod_amount}đ </p>
                        <p className='fw-bold'> {order.shipping_fee}đ </p>
                        <p className='fw- total'> {order.cod_amount + order.shipping_fee}đ </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SpecificSenderOrder