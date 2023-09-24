import React, { useContext, useEffect, useState } from 'react'
import './index.scss'
import SelectOption from 'components/SelectOption'
import { useDispatch, useSelector } from 'react-redux'
import { getStocks } from 'features/stock/stockSlice';
import { getVehiclesInOrderManagement } from 'features/delivery/deliverySlice'
import { SocketContext } from 'index';
import { toast } from 'react-toastify';

const deliveryTypeList = [
    {
        value: 'inner_sender',
        label: 'Vận chuyển nội thành từ người gửi'
    },
    {
        value: 'inter',
        label: 'Vận chuyển liên tỉnh'
    },
    {
        value: 'inner_receiver',
        label: 'Vận chuyển nội thành đến người nhận'
    },
]

const formData = {
    orderId: '',
    stock: '',
    deliveryType: '',
    vehicle: '',
}

function AdminOrderManagement() {
    const { stocks } = useSelector(state => state.stock);
    const { vehicles } = useSelector(state => state.delivery);
    const [info, setInfo] = useState(formData);
    const dispatch = useDispatch();
    const [stockData, setStockData] = useState([]);
    const [vehicleData, setVehicleData] = useState([]);
    const socket = useContext(SocketContext);


    const handleSelectChange = (field, selected) => {
        setInfo(prev => ({ ...prev, [field]: selected }))
    }

    const handleChangeInfo = e => {
        const value = e.target.value;
        const name = e.target.name;
        setInfo(prev => ({ ...prev, [name]: value }));
    }

    const handleSubmit = () => {
        socket.emit('newDeliveries', [{
            order_id: info.orderId,
            status: 'waiting',
            vehicle_id: info.vehicle.value,
            area_code: info.stock.value.area_code, 
            district_code: info.stock.value.district_code,
            type: info.deliveryType.value,
            admin_assign: true
        }]);
        toast.success('Gán đơn vận chuyển thành công');
        setInfo(formData)
    }

    useEffect(() => {
        if (stocks?.length > 0) {
          setStockData(stocks.map(stock => ({label: stock.name, value: {area_code: stock.area_code, district_code: stock.district_code}})));
        }
    }, [stocks]);

    useEffect(() => {
        if (info.stock && info.deliveryType) {
            dispatch(getVehiclesInOrderManagement({
                type: info.deliveryType.value, 
                area_code: info.stock.value.area_code, 
                district_code: info.stock.value.district_code
            }));
        }
    }, [info.stock, info.deliveryType]);

    useEffect(() => {
        setVehicleData(vehicles.map(vehicle => ({label: `${vehicle.license_plate_number} ${vehicle.current_weight}kg/${vehicle.max_weight}kg`, value: vehicle._id})));
    }, [vehicles]);

    useEffect(() => {
        dispatch(getStocks());
    }, []);

    return (
        <div className='admin-order-management'>
            <h2 className='fs-5 pb-3'>Quản lý đơn hàng</h2>
            <div className='form-wrapper'>
                <h5 className='title'>Gán đơn hàng cho tài xế vận chuyển</h5>
                <div className="form-group">
                    <label>Mã đơn hàng</label>
                    <input type="text"
                        name="orderId"
                        value={info.orderId}
                        placeholder='Nhập vào mã đơn hàng'
                        onChange={(e) => handleChangeInfo(e)} />
                </div>
                <div className="form-group">
                    <label>Kho hoạt động</label>
                    <SelectOption name="stock"
                        options={stockData}
                        value={info.stock}
                        placeholder='Chọn kho hoạt động'
                        onChange={selected => handleSelectChange('stock', selected)}/>
                </div>
                <div className="form-group">
                    <label>Loại hình vận chuyển</label>
                    <SelectOption name="deliveryType"
                        options={deliveryTypeList}
                        value={info.deliveryType}
                        placeholder='Chọn quyền nhân viên'
                        onChange={selected => handleSelectChange('deliveryType', selected)} />
                </div>
                <div className="form-group">
                    <label>Xe tải thực hiện</label>
                    <SelectOption name="vehicle"
                        options={vehicleData}
                        value={info.vehicle}
                        placeholder='Chọn xe tải thực hiện'
                        onChange={selected => handleSelectChange('vehicle', selected)} />
                </div>
       
                <button className='btn btn-medium' onClick={handleSubmit}>Gửi yêu cầu</button>
            </div>
        </div>
    )
}

export default AdminOrderManagement