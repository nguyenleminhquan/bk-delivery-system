import { useEffect, useState } from 'react';
// Icon import
import { BiEdit } from 'react-icons/bi';
import { AiOutlinePlus } from 'react-icons/ai';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
// Component import
import Table from 'components/Table';
// Utils import
import { getVehicles } from 'features/delivery/deliverySlice';
import { VehicleType, VehicleTypeLabel } from 'utils/enums/vehicle.enum';
// Style import
import './index.scss';
import GeneralConfirm from 'components/GeneralConfirm';
import { VehicleTypes } from 'utils/consts';
import { getStocks } from 'features/stock/stockSlice';
import VehicleManagementUpsert from 'components/VehicleManagementUpsert';

const vehicleModels = {
  columns: [
    {
      label: 'Loại xe',
      field: 'type',
      sort: 'asc',
      width: 100
    },
    {
      label: 'Biển số xe',
      field: 'license',
      sort: 'asc',
      width: 200
    },
    {
      label: 'Khối lượng',
      field: 'net',
      sort: 'asc',
      width: 200
    },
    {
      label: 'Tài xế',
      field: 'driver',
      sort: 'asc',
      width: 200
    },
    {
      label: 'Sửa',
      field: 'edit',
      sort: 'asc',
      width: 200
    },
    {
      label: 'Xóa',
      field: 'delete',
      sort: 'asc',
      width: 200
    }
  ],
  rows: []
}

function AdminVehicleManagement() {
  const dispatch = useDispatch();
  const { stocks } = useSelector(state => state.stock);
  const { vehicles } = useSelector(state => state.delivery);
  const [data, setData] = useState(vehicleModels);
  const [showEditPopup, setShowEditPopup] = useState();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [stockData, setStockData] = useState([]);

  const handleDeleteVehicle = () => {

  }

  function onShowEditForm(vehicle) {
    const data = {
      type: VehicleTypes.find(type => type.value === vehicle.type),
      stock: stockData.find(stock => stock.value === vehicle.stock),
      net: vehicle.max_weight,
      license: vehicle.license_plate_number
    }
    setShowEditPopup(data);
  }

  useEffect(() => {
    setStockData(stocks.map(stock => ({label: stock.name, value: stock._id})));
  }, [stocks]);

  useEffect(() => {
    const rows = [...vehicles.map(vehicle => ({
      type: vehicle.type === VehicleType.INNER ? VehicleTypeLabel.INNER : VehicleTypeLabel.INTER,
      license: vehicle.license_plate_number,
      net: vehicle.max_weight,
      driver: vehicle?.driver ?? null,
      edit: (<BiEdit className="text-success" role="button" onClick={() => onShowEditForm(vehicle)} />),
      delete: (<RiDeleteBin6Fill className="text-danger" role="button" onClick={() => setShowDeletePopup(vehicle._id)} />)
    }))];
    setData({...data, rows});
  }, [vehicles]);

  useEffect(() => {
    dispatch(getVehicles());
    dispatch(getStocks());
  }, []);

  return (
    <div className='admin-vehicle-management-wrapper'>
      <div className="container">
        <div className="row">
            <div className="d-flex align-items-center">
              <h2 className='fs-4'>Quản lí phương tiện</h2>
            <button className='btn btn-medium ms-3' onClick={() => setShowEditPopup(true)}>
              <AiOutlinePlus className='me-2'/>
              Thêm mới</button>
            </div>
        </div>
        <div className="row mt-4">
            <Table data={data}/>
        </div>
      </div>

      {showEditPopup && (
        <GeneralConfirm 
          title={showEditPopup.license ? 'Cập nhật thông tin xe' : 'Thêm xe'}
          cancelText="Đóng lại"
          onCancel={() => setShowEditPopup(false)}
          disableCancel={true}
          message={<VehicleManagementUpsert object={showEditPopup} handleClose={() => setShowEditPopup(null)} />}
        />
      )}

      {showDeletePopup && (
        <GeneralConfirm 
          title="Xóa"
          message="Bạn có muốn xóa xe này không?"
          onCancel={() => setShowDeletePopup(false)}
          cancelText="Đóng lại"
          showConfirmButton={true}
          confirmText="Xác nhận"
          onConfirm={handleDeleteVehicle}
        />
      )}
    </div>
  )
}

export default AdminVehicleManagement;
