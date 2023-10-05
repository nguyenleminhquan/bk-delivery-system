import React from 'react'
import './index.scss'
import AssignOrderToVehicle from 'components/AssignOrderToVehicle'

function AdminOrderManagement() {

    return (
        <div className='admin-order-management'>
            <h2 className='fs-5 pb-3 d-none d-sm-block'>Quản lý đơn hàng</h2>
            <AssignOrderToVehicle />
        </div>
    )
}

export default AdminOrderManagement