import SelectOption from "components/SelectOption";
import { addVehicle } from "features/delivery/deliverySlice";
import { getStocks } from "features/stock/stockSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AreaDelivery, DeliveryRoutes, VehicleTypes } from "utils/consts"
import { VehicleType } from "utils/enums/vehicle.enum";

const infoModel = {
  type: '',
  license: '',
  net: '',
  stock: '',
  route: '',
  city: '',
}

function VehicleManagementUpsert({ object, handleClose }) {
  const dispatch = useDispatch();
  const { stocks } = useSelector(state => state.stock);
  const [info, setInfo] = useState(object ?? infoModel);
  const [stockData, setStockData] = useState([]);
  const [routeData, setRouteData] = useState([]);
  const [cityData, setCityData] = useState([]);

  const handleChangeInfo = e => {
    const name = e.target.name;
    const value = e.target.value;
    setInfo(prev => ({...prev, [name]: value}));
  }

  const handleSelectChange = (field, selected) => {
    setInfo(prev => ({...prev, [field]: selected}));
  }

  const handleSubmit = e => {
    e.preventDefault();
    if (!info?.type || !info?.license || !info.net) {
      toast.error('Thiếu thông tin xe!');
      return;
    }
    const payload = {
      max_weight: Number(info.net),
      license_plate_number: info.license,
      type: info.type.value
    }

    if (payload.type === VehicleType.INTER) {
      if (!info?.route || !info?.city) {
        toast.error('Thiếu thông tin xe!');
        return;
      }
      Object.keys(DeliveryRoutes).forEach(key => {
        if (DeliveryRoutes[key].short_name === info.route.value) {
          payload.to = key;
        }
      })
      payload.from = info.city.value;
    } else {
      if (!info?.stock) {
        toast.error('Thiếu thông tin xe!');
        return;
      }
      payload.from = stocks.find(stock => stock._id === info.stock.value).area_code;
    }
    dispatch(addVehicle(payload));
    handleClose();
  }

  useEffect(() => {
    if (stocks) {
      setStockData(stocks.map(stock => ({label: stock.name, value: stock._id})));
    }
  }, [stocks]);

  useEffect(() => {
    dispatch(getStocks());
    setRouteData(Object.values(DeliveryRoutes).map(el => ({ label: el.full_name, value: el.short_name })));
    setCityData(AreaDelivery.map(el => ({label: el.label, value: el.code})));
  }, []);

  return (
    <div className='vehicle-management-upsert-wrapper'>
      <div className="form-group">
        <label>Loại xe</label>
        <SelectOption name="type"
          options={VehicleTypes}
          value={info.type}
          placeholder='Chọn loại xe'
          onChange={selected => handleSelectChange('type', selected)}/>
      </div>

      <div className="form-group">
        <label>Biển số xe</label>
        <input type="text"
          name='license'
          value={info.license}
          placeholder='Nhập vào biển số xe'
          onChange={(e) => handleChangeInfo(e)}/>
      </div>

      <div className="form-group">
        <label>Khối lượng</label>
        <input type="text"
          name='net'
          value={info.net}
          placeholder='Nhập vào khối lượng'
          onChange={(e) => handleChangeInfo(e)}/>
      </div>

      {info?.type && info.type.value === VehicleType.INNER &&
        <div className="form-group">
          <label>Kho hoạt động</label>
          <SelectOption name="stock"
            options={stockData}
            value={info.stock}
            placeholder='Chọn kho hoạt động'
            onChange={selected => handleSelectChange('stock', selected)}/>
        </div>
      }

      {info?.type && info.type.value === VehicleType.INTER && 
        <div className="form-group">
          <label>Tỉnh/Thành phố hoạt động</label>
          <SelectOption name="city"
            options={cityData}
            value={info.city}
            placeholder='Chọn tỉnh/thành phố hoạt động'
            onChange={selected => handleSelectChange('city', selected)}/>
        </div>
      }

      {info?.type && info.type.value === VehicleType.INTER && (
        <div className="form-group">
          <label>Tuyến vận chuyển</label>
          <SelectOption name="route"
            options={routeData}
            value={info.route}
            placeholder='Chọn tuyến vận chuyển'
            onChange={selected => handleSelectChange('route', selected)}/>
        </div>
      )}

      <div className="d-flex float-end mt-3">
        <button style={{backgroundColor: '#6C757D'}} className='btn btn-medium' onClick={handleClose}>Đóng lại</button>
        <button className="btn btn-medium ms-1" onClick={handleSubmit}>
          {object?.fullname ? 'Chỉnh sửa' : 'Thêm mới'}
        </button>
      </div>
    </div>
  )
}

export default VehicleManagementUpsert
