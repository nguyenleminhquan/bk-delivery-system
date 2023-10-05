import { SocketContext } from 'index';
import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify';

const formData = {
    orderId: '',
    vehicleId: ''
}

function RemoveOrderFromVehicle({ order_id='', vehicle_id='', handleClose=null }) {
    const socket = useContext(SocketContext);
    const [info, setInfo] = useState({
        orderId: order_id,
        vehicleId: vehicle_id
    });

    const handleChangeInfo = e => {
        const value = e.target.value;
        const name = e.target.name;
        setInfo(prev => ({ ...prev, [name]: value }));
    }

    const handleSubmit = () => {
        socket.emit('removeDeliveryFromVehicle', {
            order_id: info.orderId,
            vehicle_id: info.vehicleId
        });
        toast.success('Xóa đơn hàng khỏi xe tải thành công')
    }

    return (
        <div>
            <div className='form-wrapper'>
                <div className="form-group">
                    <label>Mã đơn hàng</label>
                    <input type="text"
                        name="orderId"
                        value={order_id ? order_id : info.orderId}
                        placeholder='Nhập vào mã đơn hàng'
                        onChange={(e) => handleChangeInfo(e)} />
                </div>
                <div className="form-group">
                    <label>Mã xe tải</label>
                    <input type="text"
                        name="vehicleId"
                        value={vehicle_id ? vehicle_id : info.vehicle_id}
                        placeholder='Nhập vào mã xe tải'
                        onChange={(e) => handleChangeInfo(e)} />
                </div>
                <div className="text-end">
                    {
                        handleClose && <button className='btn btn-medium' onClick={handleClose}>Đóng lại</button>
                    }
                    <button className='btn btn-medium' onClick={handleSubmit}>Gửi yêu cầu</button>
                </div>
            </div>
        </div>
    )
}

export default RemoveOrderFromVehicle