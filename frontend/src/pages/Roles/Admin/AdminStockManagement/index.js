import GeneralConfirm from 'components/GeneralConfirm';
import Table from 'components/Table';
import { addStock, deleteStock, getStocks } from 'features/stock/stockSlice';
import { useEffect, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { BiEdit } from 'react-icons/bi';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import styles from './AdminStockerManagement.module.scss';

const stockModels = {
    columns: [
        {
            label: 'Mã khu vực',
            field: 'area_code',
            sort: 'asc',
            width: 200
        },
        {
            label: 'Tên kho',
            field: 'name',
            sort: 'asc',
            width: 200
        },
        {
            label: 'Địa chỉ',
            field: 'address',
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

function AdminStockManagement() {
    const dispatch = useDispatch();
    const {stocks} = useSelector(state => state.stock);
    const [data, setData] = useState(stockModels);
    const [showEditPopup, setShowEditPopup] = useState();
    const [showDeletePopup, setShowDeletePopup] = useState('');

    const handleAddStock = payload => {
        const name = payload.name;
        const address = payload.address;
        const area_code = Number(payload.area_code);

        dispatch(addStock({name, address, area_code}));
        setShowEditPopup('');
    }

    const handleEditStock = payload => {
        
    }

    const handleDeleteStock = () => {
        dispatch(deleteStock(showDeletePopup));
        setShowDeletePopup('');
    }

    useEffect(() => {
        const rows = [...stocks.map(stock => ({
            ...stock,
            edit: (<BiEdit className="text-success" role="button" onClick={() => setShowEditPopup(stock)}/>),
            delete: (<RiDeleteBin6Fill className="text-danger" role="button" onClick={() => setShowDeletePopup(stock._id)}/>)
        }))];

        setData({...data, rows});
    }, [stocks]);

    useEffect(() => {
        dispatch(getStocks());
    }, []);

    return (
        <div className={styles.wrapper}>
            <div className="container">
                <div className="row">
                    <div className="d-flex align-items-center">
                        <h2 className='fs-4'>Quản lí nhân viên</h2>
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
                    title="Thêm mới"
                    cancelText="Đóng lại"
                    onCancel={() => setShowEditPopup(false)}
                    confirmText="Thêm mới"
                    onConfirm={handleAddStock}
                    showForm={true}
                    formFields={[
                        { name: "name", label: "Tên kho", type: "text", value: showEditPopup.name },
                        { name: "area_code", label: "Mã kho", type: "text", value: showEditPopup.area_code}
                    ]}
                    formValue={showEditPopup}
                    formSubmitText="Thêm mới"
                    addressAutoForm={true}
                />
            )}

            {showDeletePopup && (
                <GeneralConfirm 
                    title="Xóa"
                    message="Bạn có muốn xóa kho này không?"
                    onCancel={() => setShowDeletePopup('')}
                    cancelText="Đóng lại"
                    showConfirmButton={true}
                    onConfirm={handleDeleteStock}
                    confirmText="Xác nhận"
                />
            )}
        </div>
    );
}

export default AdminStockManagement;
