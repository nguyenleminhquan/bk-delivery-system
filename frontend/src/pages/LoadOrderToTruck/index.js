import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { TbFileExport } from 'react-icons/tb';
import { BiPencil, BiPackage } from 'react-icons/bi';
import { TbTruckDelivery } from 'react-icons/tb';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { TruckIcon } from 'components/Icons';
import { useState, useEffect } from 'react';
import styles from './LoadOrderToTruck.module.scss'
import ConfirmPopup from 'components/ConfirmPopup';
import { useDispatch, useSelector } from 'react-redux';
import { deleteVehicleOrder, exportOrderOnVehicle, getVehicleOrderLists, postVehicleOrders } from 'features/delivery/deliverySlice';
import ImportOrder from 'components/ImportOrder';
import GeneralConfirm from 'components/GeneralConfirm';
import SpecificSenderOrder from 'components/SpecificSenderOrder';
import { getAvailableVehicleOrders } from 'features/stock/stockSlice';


const ConfirmOrderLists = ({vehicle}) => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.user);
    const [toggleFilter, setToggleFilter] = useState(false);
    const { vehicleOrders } = useSelector(state => state.delivery);
    const [showOrderDetail, setShowOrderDetail] = useState(null);
    
    const handleSortCol = () => {
        /**
         * order (true) -> sort asc
         * order (false) ->  sort desc
         */
        if (!toggleFilter) {
            vehicleOrders.sort((a, b) => a.weight - b.weight);
        } else {
            vehicleOrders.sort((a, b) => b.weight - a.weight);
        }
        setToggleFilter(!toggleFilter);
    }

    const handleDeleteOrder = id => {
        const payload = {
            order_id: id,
            vehicle_id: vehicle._id
        }
        dispatch(deleteVehicleOrder(payload));
    }

    useEffect(() => {
        dispatch(getVehicleOrderLists({vehicle_id: vehicle._id }));
    }, [])

    return (
        <div className={styles.customTableWrap}>
            <div className={styles.customTable}>
                <div className={`row p-2 ${styles.ordersHeader}`}>
                    <div className='col-6'>Mã đơn hàng</div>
                    <div className='col-5'>
                        <div className="d-flex">
                            Khối lượng(kg)
                            <a className={`${styles.arrowIcon} ${toggleFilter ? styles.open : ''}`} onClick={handleSortCol}>
                                <span className={styles.leftBar}></span>
                                <span className={styles.rightBar}></span>
                            </a>
                        </div>
                    </div>
                    <div className="col-1"></div>
                </div>
                <div className={styles.ordersWrap}>
                    {vehicleOrders.map(order => (
                        <div className={`row p-2 ${styles.ordersRow}`} key={order._id} onClick={() => setShowOrderDetail(order)}>
                            <div className="col-6">{order._id}</div>
                            <div className="col-5">{order.weight}</div>
                            <div className="col-1">
                                <div className={styles.deleteBtn} role="button" onClick={() => handleDeleteOrder(order._id)}><RiDeleteBin6Fill /></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showOrderDetail && <SpecificSenderOrder order={showOrderDetail} closeModal={() => setShowOrderDetail(null)} />}
        </div>
    );
}

function LoadOrderToTruck() {
    const dispatch = useDispatch();
    const { orders } = useSelector(state => state.delivery);
    const { user } = useSelector(state => state.user);
    const { vehicles, availOrders } = useSelector(state => state.stock);
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const truckId = queryParams.get('truckId');
    const [truckInfo, setTruckInfo] = useState({});
    // const {truckInfo} = location.state;
    const [truckAvailable, setTruckAvailable] = useState(truckInfo.max_weight - truckInfo.current_weight);

    const [truckOrders, setTruckOrders] = useState([]);
    const [selected, setSelected] = useState(0);
    const [totalWeight, setTotalWeight] = useState(0);
    const [toggleAll, setToggleAll] = useState(false);
    const [truckLoad, setTruckLoad] = useState([]);

    const [toggleFilter, setToggleFilter] = useState(false);
    const [openPopup, setOpenPopup] = useState(false);
    const [openExportOrderPopup, setOpenExportOrderPopup] = useState(null);
    const [exportPopupObject, setExportPopupObject] = useState({});
    const [toggleImportPopup, setToggleImportPopup] = useState(false);
    const [showOrderDetail, setShowOrderDetail] = useState(null);

    const handleLoadOrder = (order, e) => {
        e.preventDefault();
        e.stopPropagation();
        setTruckOrders(prev => {
            return prev.map(el => {
                if (el._id === order._id) {
                    return {...el, checked: !el.checked}
                } return el;
            })
        });
        
    }

    const handleSetStatus = percent => {
        let className = styles.status;
        if (percent < 0.5) {
            className += ` ${styles.goodStatus}`;
        } else if (percent >= 0.5 && percent < 0.8) {
            className +=  ` ${styles.normalStatus}`;
        } else className += ` ${styles.dangerStatus}`;
        return className;
    }

    const handleChooseColor = percent => {
        if (percent < 0.5) {
            return '#008000';
        } else if (percent >= 0.5 && percent < 0.8) {
            return '#ffa500';
        } else return '#ff0000';
    }

    const handleAddToTruck = () => {
        const totalClickedWeight = truckLoad.reduce((acc, cur) => acc + cur.weight, 0);
        const totalWeight = truckAvailable - totalClickedWeight;
        if (totalWeight < 0) {
            alert('Vượt quá khối lượng hiện tại cho phép của xe!');
            // setTruckLoad([]);
        } else {
            setTruckAvailable(totalWeight);
            dispatch(postVehicleOrders({
                vehicle_id: truckInfo._id,
                list_orders: truckOrders.filter(order => order.checked).map(item => item._id),
                stock_id: user.stock_id
            }));
            const payload = { stock_id: user.stock_id, vehicle_id: truckId }
            dispatch(getAvailableVehicleOrders(payload));
        }
    }

    const handleOpenTruckOrders = () => {
        setOpenPopup(true);
    }

    const handleToggleAll = e => {
        if (e.target.checked) {
            setTruckOrders(prev => prev.map(item => ({...item, checked: true})));
            setTruckLoad(availOrders);
            setTotalWeight(availOrders.reduce((acc, cur) => acc + cur.weight, 0));
            setSelected(availOrders.length);
        } else {
            setTruckOrders(prev => prev.map(item => ({...item, checked: false})));
            setTruckLoad([]);
            setTotalWeight(0);
            setSelected(0);
        }
    }

    const isAllChecked = () => {
        return truckOrders.length > 0 && truckOrders?.every(order => order.checked);
    }

    const handleSortCol = () => {
        /**
         * order (true) -> sort asc
         * order (false) -> sort desc
         */
        if (!toggleFilter) {
            orders.sort((a, b) => a.weight - b.weight);
        } else {
            orders.sort((a, b) => b.weight - a.weight);
        }
        setToggleFilter(!toggleFilter);
    }

    const handleExportOrder = () => {
        setOpenExportOrderPopup(true);
        if (truckInfo.current_weight < truckInfo.max_weight) {
            const availableWeight = truckInfo.max_weight - truckInfo.current_weight;
            setExportPopupObject({
                title: 'Xe tải vẫn còn khả dụng',
                content: `Hiện tải xe tải vẫn còn trống ${availableWeight}kg, bạn có muốn chọn thêm đơn hàng vào xe không?`,
                okLabel: 'OK',
                actionYes: () => setOpenExportOrderPopup(false),
                cancelLabel: 'Tiếp tục xuất kho',
                actionNo: confirmExportOrder
            });
        } else {
            setExportPopupObject({
                title: 'Xác nhận xuất kho',
                content: `Bạn chắc chắn xuất hàng trên xe tải từ ${truckInfo.from_string} đến ${truckInfo.to_string} không?`,
                okLabel: 'OK',
                actionYes: confirmExportOrder,
                cancelLabel: 'Hủy',
                actionNo: () => setOpenExportOrderPopup(false)
            });
        }
    }

    const enableAddToTruck = () => {
        return truckOrders.some(el => el.checked);
    }

    function confirmExportOrder() {
        const payload = { vehicle_id: truckInfo._id, stocker_id: user.id };
        dispatch(exportOrderOnVehicle(payload));
        setOpenExportOrderPopup(false);
        navigate('/');
    }

    useEffect(() => {
        const checkedOrders = truckOrders.filter(order => order.checked);
        const totalWeight = checkedOrders.reduce((acc, cur) => acc + cur.weight, 0);
        setToggleAll(isAllChecked());
        setSelected(checkedOrders.length);
        setTotalWeight(totalWeight);
        // setTruckInfo(prev => ({...prev, current_weight: prev.current_weight + totalWeight}));
    }, [truckOrders]);

    useEffect(() => {
        setTruckOrders(availOrders.map(order => ({...order, checked: false})));
    }, [availOrders])

    useEffect(() => {
        if (truckId) {
            const payload = { stock_id: user.stock_id, vehicle_id: truckId }
            dispatch(getAvailableVehicleOrders(payload));
            if (vehicles.length > 0) {
                setTruckInfo(vehicles.find(vehicle => vehicle?._id === truckId));
            } else {
                setTruckInfo(JSON.parse(localStorage.getItem('activeTruck')))
            }
        }
    }, [vehicles]);

    return (
        <div className={styles.wrapper}>
            <div className="row">
                <header className='d-flex justify-content-between align-items-center'>
                    <h2 className='fs-4'>Xuất kho</h2>
                    <div className={styles.action}>
                        <Link className={`btn ${styles.customBtn}`} to="/">
                            <TbFileExport className='me-3'/> Xuất Excel
                        </Link>

                        <Link className={`btn ${styles.customBtn} ${styles.active}`} to="/export-order">
                            <BiPencil className='me-3'/> Xuất Kho
                        </Link>

                        <Link className={`btn ${styles.customBtn}`} onClick={() => setToggleImportPopup(true)}>
                            <BiPencil className='me-3'/> Nhập Kho
                        </Link>
                    </div>
                </header>
            </div>
            <div className="row mt-3">
                <div className="col-12">
                    <span className={styles.truckLabel}>{truckInfo.from_string} - {truckInfo.to_string}, {truckInfo.license_plate_number}</span>
                </div>
            </div>
            <div className="row mt-2">
                <div className="col-5">
                    <div className={styles.leftCol}>
                        <div className={styles.title}>Truck Load</div>
                        <div className={handleSetStatus((truckInfo.current_weight + totalWeight) / truckInfo.max_weight)}>{(((truckInfo.current_weight + totalWeight) / truckInfo.max_weight)*100).toFixed(2)}%</div>
                        <div className="my-5">
                            <TruckIcon 
                                width="80%"
                                height="100%" 
                                availability={(truckInfo.current_weight + totalWeight) / truckInfo.max_weight}
                                color={handleChooseColor((truckInfo.current_weight + totalWeight) / truckInfo.max_weight)}
                            />
                        </div>
                        <div className={styles.action}>
                            <button className='btn customBtn m-0 mb-2'
                                onClick={handleOpenTruckOrders}>
                                <BiPackage className='me-2'/>
                                Danh sách đơn hàng</button>
                            <button className='btn customBtn active m-0'
                                onClick={handleExportOrder}>
                                <TbTruckDelivery className='me-2'/>
                                Hoàn tất xuất kho
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-7">
                    <div className={styles.rightCol}>
                        <div className={styles.title}>
                            <h5 className='fw-semibold'>Danh sách đơn hàng</h5>
                            <span>Đã chọn: {selected}, KL(kg): {totalWeight}</span>
                        </div>
                        <div className={styles.customTableWrap}>
                            <div className={styles.customTable}>
                                <div className={`row p-2 ${styles.ordersHeader}`}>
                                    <div className='col-1 d-flex'><input type="checkbox" checked={toggleAll} onChange={handleToggleAll}/></div>
                                    <div className='col-6'>Mã đơn hàng</div>
                                    <div className='col-5'>
                                        <div className="d-flex">
                                            Khối lượng
                                            <a className={`${styles.arrowIcon} ${toggleFilter ? styles.open : ''}`} onClick={handleSortCol}>
                                                <span className={styles.leftBar}></span>
                                                <span className={styles.rightBar}></span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.ordersWrap}>
                                    {truckOrders.length > 0 
                                        ? (truckOrders.map(order => (
                                            <div className={`row p-2 ${styles.ordersRow}`} key={order._id}>
                                                <div className='col-1 d-flex'><input type="checkbox"
                                                    checked={order.checked}
                                                    onChange={e => handleLoadOrder(order, e)}
                                                /></div>
                                                <div className="col-6" onClick={() => setShowOrderDetail(order)}>{order._id}</div>
                                                <div className="col-5" onClick={() => setShowOrderDetail(order)}>{order.weight}</div>
                                            </div>)))
                                        : (<div className='p-2'>Không có đơn hàng nào</div>)
                                    }

                                </div>
                            </div>

                        </div>
                        <button className='btn btn-medium mt-2 d-flex jc_c'
                            onClick={handleAddToTruck}
                            disabled={() => !enableAddToTruck()}>Thêm vào xe tải</button>
                    </div>
                </div>
            </div>

            {openPopup && (
                <ConfirmPopup title="Danh sách đơn hàng"
                    content={<ConfirmOrderLists vehicle={truckInfo}/>}
                    okLabel="OK"
                    actionYes={() => setOpenPopup(false)}
                />
            )}
        
            {openExportOrderPopup && <ConfirmPopup {...exportPopupObject}/> }

            {toggleImportPopup && (
                <GeneralConfirm
                    title="Thêm đơn hàng mới vào kho"
                    message={<ImportOrder closePopup={() => setToggleImportPopup(false)} />}
                    disableCancel={true}
                />
            )}

            {showOrderDetail && <SpecificSenderOrder order={showOrderDetail} closeModal={() => setShowOrderDetail(null)} />}
        </div>
    );
}

export default LoadOrderToTruck;

