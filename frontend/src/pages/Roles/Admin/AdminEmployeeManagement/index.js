import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

// Import redux
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, getAllEmployee, registerUser, updateUser } from 'features/user/userSlice';

// Import icon
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { AiOutlinePlus } from 'react-icons/ai';
import { IoMdCall } from 'react-icons/io';
import { FaUser } from 'react-icons/fa';
import { BiEdit } from 'react-icons/bi';
import { HiMail } from 'react-icons/hi'

// Import component
import Table from '../../../../components/Table'
import GeneralConfirm from 'components/GeneralConfirm';

// Import scss
import styles from './AdminEmployeeManagement.module.scss';

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
        code: 'driver_inner'
    },
    {
        label: 'Tài xế liên tỉnh',
        code: 'driver_inter'
    },
    {
        label: 'Quản lí kho',
        code: 'stocker'
    }
]
const DEFAULT_PASSWORD = '1234567890';

function AdminEmployeeManagement() {
    const dispatch = useDispatch();
    const { employees } = useSelector(state => state.user);
    const [data, setData] = useState(employeeModels);
    const [editPopup, setEditPopup] = useState();
    const [deletePopup, setDeletePopup] = useState(''); 

    const handleAddEmployee = (formData) => {
        if (formData.fullname && formData.phone && formData.email && formData.typeUser) {
            // Create new employee with default password: 1234567890
            dispatch(registerUser({
                ...formData,
                password: DEFAULT_PASSWORD
            }));
            setEditPopup(false);
        } else {
            return toast.error('Thiếu thông tin nhân viên.');
        }
    }

    const handleEditEmployee = (formData) => {
        const updatedData = {...editPopup, ...formData};
        if (updatedData?.fullname && updatedData?.phone && updatedData?.email && updatedData?.typeUser) {
            dispatch(updateUser({
                userId: editPopup._id,
                info: updatedData
            }));
            setEditPopup(false);
        } else {
            return toast.error('Thiếu thông tin nhân viên.');
        }
    }

    const handleDeleteEmployee = () => {
        // Call api for PUT employee
        dispatch(deleteUser(deletePopup));
        setDeletePopup('');
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
            activeStock: 'Đống Đa, Hà Nội',
            vehicleInfo: 'Xe máy Honda 63B5-99999',
            role: 'Tài xế nội thành',
            edit: (<BiEdit className="text-success" role="button" onClick={() => setEditPopup(employee)}/>),
            delete: (<RiDeleteBin6Fill className="text-danger" role="button" onClick={() => setDeletePopup(employee._id)}/>)
        }))];
        setData({...data, rows});
    }, [employees])

    useEffect(() => {
        dispatch(getAllEmployee());
    }, [])

    return (
        <div className={styles.wrapper}>
            <div className="container">
                <div className="row">
                    <div className="d-flex align-items-center">
                        <h2 className='fs-4'>Quản lí nhân viên</h2>
                        <button className='btn btn-medium ms-3' onClick={() => setEditPopup(true)}>
                            <AiOutlinePlus className='me-2'/>
                            Thêm mới</button>
                    </div>
                </div>
                <div className="row mt-4">
                    <Table data={data}/>
                </div>
            </div>

            {editPopup && (
                <GeneralConfirm 
                    title={editPopup?.email ? 'Chỉnh sửa' : 'Thêm mới'}
                    cancelText="Đóng lại"
                    onCancel={() => setEditPopup(false)}
                    onConfirm={editPopup?.email ? handleEditEmployee : handleAddEmployee}
                    showForm={true}
                    formFields={[
                        { name: "fullname", label: "Họ và tên", type: "text", value: editPopup.fullname },
                        { name: "email", label: "Email", type: "email", value: editPopup.email },
                        { name: "phone", label: "Số điện thoại", type: "text", value: editPopup.phone },
                        { name: "typeUser", label: "Quyền", type: "select", models: roleModels, value: editPopup.typeUser},
                    ]}
                    formValue={editPopup}
                    formSubmitText={editPopup?.email ? 'Chỉnh sửa' : 'Thêm mới'}
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
