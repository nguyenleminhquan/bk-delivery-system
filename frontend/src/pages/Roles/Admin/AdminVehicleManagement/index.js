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
import { getAllEmployee } from 'features/user/userSlice';
import { EmployeeRole } from 'utils/enums';

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
  const { vehicles } = useSelector(state => state.delivery);
  const { employees } = useSelector(state => state.user);
  const [data, setData] = useState(vehicleModels);
  const [showEditPopup, setShowEditPopup] = useState();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [employeeData, setEmployeeData] = useState([]);

  const handleAddVehicle = formData => {
    console.log(formData);
  }

  const handleEditVehicle = formData => {
    console.log(formData);
  }

  const handleDeleteVehicle = () => {

  }

  function setupEmployeeData() {
    const driverRole = [EmployeeRole.DRIVER_INNER, EmployeeRole.DRIVER_INTER];
    const drivers = employees.filter(employee => driverRole.includes(employee.typeUser));
    setEmployeeData(drivers.map(driver => ({label: driver.fullname, code: driver._id})));
  }

  useEffect(() => {
    setupEmployeeData();
  }, [employees]);

  useEffect(() => {
    const rows = [...vehicles.map(vehicle => ({
      type: vehicle.type === VehicleType.INNER ? VehicleTypeLabel.INNER : VehicleTypeLabel.INTER,
      license: vehicle.license_plate_number,
      net: vehicle.max_weight,
      driver: 'Nguyễn Văn A',
      edit: (<BiEdit className="text-success" role="button" onClick={() => setShowEditPopup(vehicle)} />),
      delete: (<RiDeleteBin6Fill className="text-danger" role="button" onClick={() => setShowDeletePopup(vehicle._id)} />)
    }))];
    setData({...data, rows});
  }, [vehicles]);

  useEffect(() => {
    dispatch(getVehicles());
    dispatch(getAllEmployee());
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
          onConfirm={showEditPopup?.license ? handleEditVehicle : handleAddVehicle}
          showForm={true}
          formFields={[
            { name: "type", label: "Loại xe", type: "select", models: VehicleTypes, value: showEditPopup.type},
            { name: "license", label: "Biển số xe", type: "text", value: showEditPopup.license },
            { name: "net", label: "Khối lượng", type: "text", value: showEditPopup.net },
            { name: "driver", label: "Tài xế", type: "select", models: employeeData, value: showEditPopup.driver },
          ]}
          formValue={showEditPopup}
          formSubmitText={showEditPopup?.name ? 'Chỉnh sửa' : 'Thêm mới'}
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
