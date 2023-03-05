import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

// Import redux
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from 'features/user/userSlice';

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
import ConfirmPopup from 'components/ConfirmPopup';

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

function AdminEmployeeManagement() {
    // const { employees } = useSelector(state => state.employees);
    const dispatch = useDispatch();
    const [data, setData] = useState(employeeModels);
    const [openPopup, setOpenPopup] = useState(false);
    const [deletePopup, setDeletePopup] = useState({flag: false, data: {}}); 

    const handleConfirm = (formData) => {
        if (formData.fullname && formData.phone && formData.email && formData.typeUser) {
            // Create new employee with default password: 1234567890
            dispatch(registerUser({
                ...formData,
                password: '1234567890'
            }));
        } else return toast.error('Thiếu thông tin nhân viên');
    }

    const handleEdit = () => {
        // 
    }

    const handleConfirmDelete = (id) => {
        // Call api for PUT employee
        // Todo...
        console.log('deleted');
        setDeletePopup(false);
    }

    useEffect(() => {
        // Get employee information
        // dispatch(getEmployeeInfo())
    }, [])

    // useEffect(() => {
    //     let employeeArray = JSON.parse(JSON.stringify(employees));
    //     // handle data after call api GET to pass to employeeModels row
    // }, [employees])

    useEffect(() => {
        const rowData = [
            {
                generalInfo: (
                    <div>
                        <div className='d-flex align-items-center'>
                            <FaUser className='me-2'/> Nguyễn Văn A</div>
                        <div className='d-flex align-items-center'>
                            <HiMail className='me-2'/> a123@gmail.com</div>
                        <div className='d-flex align-items-center'>
                            <IoMdCall className='me-2'/> 0123456789</div>
                    </div>
                ),
                activeStock: 'Đống Đa, Hà Nội',
                vehicleInfo: 'Xe máy Honda 63B5-99999',
                role: 'Tài xế nội thành',
                edit: (<BiEdit className="text-success" role="button" onClick={handleEdit}/>),
                delete: (<RiDeleteBin6Fill className="text-danger" role="button" onClick={() => setDeletePopup({flag: true, data: 1})}/>)
            }
        ]

        setData({...data, rows: rowData});
    }, [])

    return (
        <div className={styles.wrapper}>
            <div className="container">
                <div className="row">
                    <div className="d-flex align-items-center">
                        <h2 className='fs-4'>Quản lí nhân viên</h2>
                        <button className='btn btn-medium ms-3' onClick={() => setOpenPopup(true)}>
                            <AiOutlinePlus className='me-2'/>
                            Thêm mới</button>
                    </div>
                </div>
                <div className="row mt-4">
                    <Table data={data}/>
                </div>
            </div>

            {openPopup && (
                <GeneralConfirm 
                    title="Thêm mới"
                    cancelText="Đóng lại"
                    onCancel={() => setOpenPopup(false)}
                    onConfirm={handleConfirm}
                    showForm={true}
                    formFields={[
                        { name: "fullname", label: "Họ và tên", type: "text" },
                        { name: "email", label: "Email", type: "email" },
                        { name: "phone", label: "Số điện thoại", type: "text" },
                        { name: "typeUser", label: "Quyền", type: "select", models: roleModels },
                    ]}
                    formSubmitText="Thêm mới"
                />
               
            )}

            {deletePopup.flag && (
                <GeneralConfirm 
                    title="Xóa"
                    message="Bạn có muốn xóa tài khoản này không?"
                    onCancel={() => setDeletePopup(false)}
                    cancelText="Đóng lại"
                    showConfirmButton={true}
                    confirmText="Xác nhận"
                    onConfirm={() => handleConfirmDelete(deletePopup.data)}
                />
            )}
        </div>
    )
}

export default AdminEmployeeManagement
