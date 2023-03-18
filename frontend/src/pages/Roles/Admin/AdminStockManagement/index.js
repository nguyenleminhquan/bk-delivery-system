import Table from 'components/Table';
import { getStocks } from 'features/stock/stockSlice';
import { useEffect, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
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
            label: 'Địa chỉ',
            field: 'address',
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

    useEffect(() => {
        const rows = [...stocks.map(stock => ({
            area_code: stock.area_code,
            address: stock.address,
            delete: (<RiDeleteBin6Fill className="text-danger" role="button" />)
        }))];

        setData({...data, rows});
    }, [stocks])

    useEffect(() => {
        dispatch(getStocks());
    }, []);

    return (
        <div className={styles.wrapper}>
             <div className="container">
                <div className="row">
                    <div className="d-flex align-items-center">
                        <h2 className='fs-4'>Quản lí nhân viên</h2>
                        <button className='btn btn-medium ms-3'>
                            <AiOutlinePlus className='me-2'/>
                            Thêm mới</button>
                    </div>
                </div>
                <div className="row mt-4">
                    <Table data={data}/>
                </div>
            </div>
        </div>
    );
}

export default AdminStockManagement;
