import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

// Import redux
import { useDispatch, useSelector } from 'react-redux';
import { createEmployee, deleteUser, editEmployee, getAllEmployee, registerUser, updateUser } from 'features/user/userSlice';

// Import icon
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { AiOutlinePlus } from 'react-icons/ai';
import { IoMdAdd, IoMdCall } from 'react-icons/io';
import { FaUser } from 'react-icons/fa';
import { BiEdit } from 'react-icons/bi';
import { HiMail } from 'react-icons/hi'

// Import component
import Table from '../../../../components/Table'
import GeneralConfirm from 'components/GeneralConfirm';

// Import scss
import styles from './AdminEmployeeManagement.module.scss';
import { AreaDelivery } from 'utils/consts/Delivery.const';
import { EmployeeManagementToast, EmployeeRole } from 'utils/enums';
import { VietNamArea } from 'utils/consts/area.const';
import EmployeeUpsert from 'components/EmployeeUpsert';
import { Link } from 'react-router-dom';

const employeeModels = {
    columns: [
        {
            label: 'Thông tin chung',
            field: 'generalInfo',
            sort: 'asc',
            width: 200
        },
        {
            label: 'Kho hoạt động',
            field: 'activeStock',
            sort: 'asc',
            width: 200
        },
        {
            label: 'Thông tin xe',
            field: 'vehicleInfo',
            sort: 'asc',
            width: 200
        },
        {
            label: 'Quyền',
            field: 'role',
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

const DEFAULT_PASSWORD = '1234567890';

function AdminEmployeeManagement() {
    const dispatch = useDispatch();
    const { employees } = useSelector(state => state.user);
    const areaData = VietNamArea.map(area => ({label: area.name, value: area.code}));
    const [data, setData] = useState(employeeModels);
    const [editPopup, setEditPopup] = useState(null);
    const [deletePopup, setDeletePopup] = useState('');

    const handleDeleteEmployee = () => {
        // Call api for PUT employee
        dispatch(deleteUser(deletePopup));
        setDeletePopup('');
    }

    function handleShowEditForm(employee) {
        const data = {
            ...employee,
            typeUser: roleModels.find(role => role.value === employee.typeUser),
            area_code: areaData.find(area => area.value === employee.area_code),
        }
        setEditPopup(data);
    }

    useEffect(() => {
        const rows = [...employees.map(employee => ({
            generalInfo: (
                <div>
                    <div className='d-flex align-items-center'>
                        <FaUser className='me-2'/> {employee.fullname}</div>
                    <div className='d-flex align-items-center'>
                        <HiMail className='me-2'/> {employee.email}</div>
                    <div className='d-flex align-items-center'>
                        <IoMdCall className='me-2'/> {employee.phone}</div>
                </div>
            ),
            activeStock: AreaDelivery.find(area => area.code === employee?.area_code)?.label ?? '',
            vehicleInfo: employee?.vehicle ?? '',
            role: roleModels.find(role => role.value === employee?.typeUser)?.label,
            edit: (<BiEdit className="text-success" role="button" onClick={() => handleShowEditForm(employee)}/>),
            delete: (<RiDeleteBin6Fill className="text-danger" role="button" onClick={() => setDeletePopup(employee._id)}/>)
        }))];
        setData({...data, rows});
    }, [employees]);

    useEffect(() => {
        dispatch(getAllEmployee());
    }, [])

    return (
        <div className={styles.wrapper}>
            <div className="container">
                <div className="row mb-4 d-none d-sm-flex ">
                    <div className="d-flex align-items-center">
                        <h2 className='fs-4'>Quản lí nhân viên</h2>
                        <button className='btn btn-medium ms-3' onClick={() => setEditPopup({})}>
                            <AiOutlinePlus className='me-2'/>
                            Thêm mới</button>
                    </div>
                </div>
                <div className='d-flex d-sm-none mobile-actions'>
                    <button className='action-btn primary ms-2' onClick={() => setEditPopup({})}>
                        <IoMdAdd />
                    </button>
                </div>
                <div className="row">
                    <Table data={data}/>
                </div>
            </div>

            {editPopup && (
                <GeneralConfirm 
                    title={editPopup?.email ? 'Chỉnh sửa' : 'Thêm mới'}
                    message={<EmployeeUpsert object={editPopup} handleClose={() => setEditPopup(null)}/>}
                    disableCancel={true}
                />
            )}

            {deletePopup && (
                <GeneralConfirm 
                    title="Xóa"
                    message="Bạn có muốn xóa tài khoản này không?"
                    onCancel={() => setDeletePopup('')}
                    cancelText="Đóng lại"
                    showConfirmButton={true}
                    confirmText="Xác nhận"
                    onConfirm={handleDeleteEmployee}
                />
            )}
        </div>
    )
}

export default AdminEmployeeManagement
