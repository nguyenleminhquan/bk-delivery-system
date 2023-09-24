// Libraries import
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

// Components import
import GeneralConfirm from 'components/GeneralConfirm';
import Table from 'components/Table';

// Utils import
import { addStock, deleteStock, editStock, getStocks } from 'features/stock/stockSlice';
import { convertAddressToCoordinates } from 'utils/geoTools';
import { VietNamArea } from 'utils/consts/area.const';

// Icons import
import { IoMdAdd } from 'react-icons/io';
import { AiOutlinePlus } from 'react-icons/ai';
import { BiEdit } from 'react-icons/bi';
import { RiDeleteBin6Fill } from 'react-icons/ri';

// Css import
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
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [coordinate, setCoordinate] = useState({});

    const handleAddStock = async payload => {
        console.log(payload);
        if (!payload.name || !payload.city || !payload.district || !payload.address) {
            toast.error('Nhập thiếu thông tin kho!');
            return;
        }
        const coordinate = await convertAddressToCoordinates(`${payload.district.label}, ${payload.city.label}`);
        const object = {
            name: payload.name, 
            address: `${payload.address}, ${payload.district.label}, ${payload.city.label}`,
            area_code: payload.city.value,
            district_code: payload.district.value,
            ...coordinate
        }

        dispatch(addStock(object));
        setShowEditPopup(false);
    }

    const handleEditStock = address => {
        dispatch(editStock(showEditPopup._id, {address}));
        setShowEditPopup(false);
    }

    const handleDeleteStock = () => {
        dispatch(deleteStock(showDeletePopup));
        setShowDeletePopup('');
    }

    function setupDistrictData(city) {
        const target = VietNamArea.find(area => area.code === city.value);
        setDistricts(target.districts.map(district => ({ label: district.name, value: district.code })));
    }

    function handleShowEditForm(stock) {
        const addressArr = stock.address.split(", ");
        const city = VietNamArea.find(area => area.code === stock.area_code);
        const district = city.districts.find(district => district.code === stock?.district_code);
        const data = {
            name: stock.name,
            address: addressArr.slice(0, addressArr.length - 2).join(', '),
            city: {label: city.name, value: city.code},
            district: {label: district.name, value: district.code},
        }
        setShowEditPopup(data);
    }

    useEffect(() => {
        const rows = [...stocks.map(stock => ({
            ...stock,
            edit: (<BiEdit className="text-success" role="button" onClick={() => handleShowEditForm(stock)}/>),
            delete: (<RiDeleteBin6Fill className="text-danger" role="button" onClick={() => setShowDeletePopup(stock._id)}/>)
        }))];

        setData({...data, rows});
    }, [stocks]);

    useEffect(() => {
        dispatch(getStocks());
        setCities(VietNamArea.map(area => ({ label: area.name, value: area.code })));
    }, []);

    return (
        <div className={styles.wrapper}>
            <div className="container">
                <div className="row mb-4 d-none d-sm-flex">
                    <div className="d-flex align-items-center">
                        <h2 className='fs-4'>Quản lí kho</h2>
                    <button className='btn btn-medium ms-3' onClick={() => setShowEditPopup(true)}>
                            <AiOutlinePlus className='me-2'/>
                            Thêm mới</button>
                    </div>
                </div>
                <div className='d-flex d-sm-none mobile-actions'>
                    <button className='action-btn primary ms-2' onClick={() => setShowEditPopup(true)}>
                        <IoMdAdd />
                    </button>
                </div>
                <div className="row">
                    <Table data={data}/>
                </div>
            </div>

            {showEditPopup && (
                <GeneralConfirm
                    title={showEditPopup?.name ? 'Chỉnh sửa' : 'Thêm mới'}
                    cancelText="Đóng lại"
                    onCancel={() => setShowEditPopup(false)}
                    onConfirm={showEditPopup?.name ? handleEditStock : handleAddStock}
                    onObserver={setupDistrictData}
                    showForm={true}
                    formFields={[
                        { name: "name", label: "Tên kho", type: "text", value: showEditPopup.name, disabled: !!showEditPopup.name },
                        { name: "city", label: "Tỉnh/Thành phố", type: "select", models: cities, value: showEditPopup.city, observerData: true, placeholder: "Chọn tỉnh/thành phố" },
                        { name: "district", label: "Quận/Huyện", type: "select", models: districts, value: showEditPopup.district, placeholder: "Chọn quận/huyện" },
                        { name: "address", label: "Địa chỉ", type: "text", value: showEditPopup.address },
                    ]}
                    formValue={showEditPopup}
                    formSubmitText={showEditPopup?.name ? 'Chỉnh sửa' : 'Thêm mới'}
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
