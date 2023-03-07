import React from 'react';
import { FaMoneyBillAlt, FaShoppingBag, FaUserPlus } from 'react-icons/fa';
import './index.scss'

function AdminHome() {
  return (
    <div className='admin-dashboard'>
      <h2 className='pb-3 fs-3'>Thống kê</h2>
      <div className='widget'>
        <div className='widget-item blue-color'>
          <p className='title'>Tài khoản mới</p>
          <div className='d-flex justify-content-between align-items-center'>
            <p className='num'>100</p>
            <FaUserPlus className='icon' />
          </div>
        </div>
        <div className='widget-item cyan-color'>
          <p className='title'>Tổng đơn hàng</p>
          <div className='d-flex justify-content-between align-items-center'>
            <p className='num'>250</p>
            <FaShoppingBag className='icon' />
          </div>
        </div>
        <div className='widget-item orange-color'>
          <p className='title'>Tổng doanh thu</p>
          <div className='d-flex justify-content-between align-items-center'>
            <p className='num'>1,45M</p>
            <FaMoneyBillAlt className='icon' />
          </div>
        </div>
        <div className='widget-item green-color'>
          <p className='title'>Nhân viên mới</p>
          <div className='d-flex justify-content-between align-items-center'>
            <p className='num'>100</p>
            <FaUserPlus className='icon' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminHome