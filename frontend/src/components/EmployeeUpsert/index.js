import SelectOption from 'components/SelectOption';
import './index.scss';
import { useEffect, useState } from 'react';
import { EmployeeRole } from 'utils/enums';
import { useDispatch, useSelector } from 'react-redux';
import { getStocks } from 'features/stock/stockSlice';
import { getVehicles } from 'features/delivery/deliverySlice';
import { toast } from 'react-toastify';
import { isArray } from 'lodash';
import { createEmployee } from 'features/user/userSlice';

const infoModel = {
  fullname: '',
  email: '',
  phone: '',
  typeUser: '',
  vehicle: '',
  stocks: '',
}
const roleModels = [
  {
    label: 'Tài xế nội thành',
    value: EmployeeRole.DRIVER_INNER
  },
  {
    label: 'Tài xế liên tỉnh',
    value: EmployeeRole.DRIVER_INTER
  },
  {
    label: 'Quản lí kho',
    value: EmployeeRole.STOCKER
  }
];

function EmployeeUpsert({object, handleClose}) {
  const dispatch = useDispatch();
  const { stocks } = useSelector(state => state.stock);
  const { vehicles } = useSelector(state => state.delivery);
  const [info, setInfo] = useState(object ?? infoModel);
  const [stockData, setStockData] = useState([]);
  const [vehicleData, setVehicleData] = useState([]);

  const handleChangeInfo = e => {
    const value = e.target.value;
    const name = e.target.name;
    setInfo(prev => ({...prev, [name]: value}));
  }

  const handleSelectChange = (field, selected) => {
    setInfo(prev => ({...prev, [field]: selected}))
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (info?.fullname && info?.email && info.typeUser && info.stocks && info.vehicle) {
      const payload = {
        fullname: info.fullname,
        email: info.email,
        phone: info.phone,
        typeUser: info.typeUser.value
      }
      if (info.typeUser.value !== EmployeeRole.STOCKER) {
        payload.vehicle = info.vehicle.value; 
      }

      if (isArray(info.stocks)) {
        const selectedStockIds = info.stocks.map(stock => stock.value);
        payload.stocks = stocks.filter(stock => selectedStockIds.includes(stock._id));
      } else {
        payload.stocks = [stocks.find(stock => stock._id === info.stocks.value)];
      }

      dispatch(createEmployee(payload));
      handleClose();
    } else {
      toast.error('Thiếu thông tin nhân viên!');
    }
  }

  useEffect(() => {
    if (vehicles) {
      setVehicleData(vehicles.map(vehicle => ({label: vehicle.license_plate_number, value: vehicle._id})));
    }
  }, [vehicles]);

  useEffect(() => {
    if (stocks) {
      setStockData(stocks.map(stock => ({label: stock.name, value: stock._id})));
    }
  }, [stocks]);

  useEffect(() => {
    dispatch(getStocks());
    dispatch(getVehicles());
  }, []);

  return (
    <form className='employee-upsert-wrapper'>
      <div className="form-group">
        <label>Họ và tên</label>
        <input type="text"
          name="fullname"
          value={info.fullname}
          placeholder='Nhập vào họ tên'
          onChange={(e) => handleChangeInfo(e)}/>
      </div>

      <div className="form-group">
        <label>Email</label>
        <input type="email"
          name='email'
          value={info.email}
          placeholder='Nhập vào email'
          onChange={(e) => handleChangeInfo(e)}/>
      </div>

      <div className="form-group">
        <label>Số điện thoại</label>
        <input type="text"
          name='phone'
          value={info.phone}
          placeholder='Nhập vào số điện thoại'
          onChange={(e) => handleChangeInfo(e)}/>
      </div>

      <div className="form-group">
        <label>Quyền</label>
        <SelectOption name="typeUser"
          options={roleModels}
          value={info.typeUser}
          placeholder='Chọn quyền nhân viên'
          onChange={selected => handleSelectChange('typeUser', selected)}/>
      </div>

      {info?.role && info.typeUser.value !== EmployeeRole.STOCKER && (
        <div className="form-group">
          <label>Phương tiện</label>
          <SelectOption name="vehicle"
            options={vehicleData}
            value={info.vehicle}
            placeholder='Chọn xe tải'
            onChange={selected => handleSelectChange('vehicle', selected)}/>
        </div>
      )}

      <div className="form-group">
        <label>Kho hoạt động</label>
        <SelectOption name="stocks"
          options={stockData}
          value={info.stocks}
          placeholder='Chọn kho hoạt động'
          isMulti={info.typeUser?.value === EmployeeRole.DRIVER_INTER}
          onChange={selected => handleSelectChange('stocks', selected)}/>
      </div>

      <div className="d-flex float-end mt-3">
        <button style={{backgroundColor: '#6C757D'}} className='btn btn-medium' onClick={handleClose}>Đóng lại</button>
        <button className="btn btn-medium ms-1" onClick={handleSubmit}>
          {object ? 'Chỉnh sửa' : 'Thêm mới'}
        </button>
      </div>
    </form>
  )
}

export default EmployeeUpsert
