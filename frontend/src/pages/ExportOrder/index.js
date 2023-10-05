// Libraries import
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

// Components import
import { TruckIcon } from 'components/Icons';
import ImportOrder from 'components/ImportOrder';
import StockerHeader from 'components/StockerHeader';
import GeneralConfirm from 'components/GeneralConfirm';
import Tabs from 'components/Tabs';

// Utils import
import { getStockVehicles } from 'features/stock/stockSlice';

// Css import
import styles from './ExportOrder.module.scss';
import { AreaDelivery, VehicleStatuses, VehicleTypes } from 'utils/consts';
import { VehicleStatus, VehicleType } from 'utils/enums/vehicle.enum';
import { FaTimes } from 'react-icons/fa';
import { BsCheck2Circle } from 'react-icons/bs';
import { FiLoader } from 'react-icons/fi';
import { CiCircleMore } from 'react-icons/ci';
import { BiCheck } from 'react-icons/bi';
import { getVehicleOrderLists } from 'features/delivery/deliverySlice';

/** Dựa vào địa điểm làm việc của stocker, khi xuất kho sẽ hiển thị các xe tải phù hợp:
 * VD: - Stocker ở kho tổng Hồ Chí Minh -> hiển thị các xe tải về các tỉnh
 *     - Stocker ở kho tỉnh -> hiển thị các xe tải về kho tổng Hồ Chí Minh   
 */
const routeModels = {
    source: '',
    destination: '',
    label: 'Tất cả'
}

const tabs = [
    {
		field: 'inter',
		name: 'Liên tỉnh'
	},
    {
        field: 'inner',
        name: 'Nội thành'
    }
]
/** Truck info:
 * 0 <= available < 50% -> #008000 (Green)
 * 50% <= available < 80% -> #ffa500 (Yellow)
 * 80% <= available < 100% -> #ff0000 (Red)
 */
function ExportOrder() {
    const { vehicles } = useSelector(state => state.stock);
    const { user } = useSelector(state => state.user);
    const { vehicleOrders } = useSelector(state => state.delivery);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [selectedTab, setSelectedTab] = useState(tabs[0]);
    const [availVehicle, setAvailVehicle] = useState([]);
    const [routeFilters,  setRouteFilters] = useState([routeModels]);
    const [selectedRouteFilter, setSelectedRouteFilter] = useState(routeFilters[0].label);
    const [toggleImportPopup, setToggleImportPopup] = useState(false);
    const [vehicleTracking, setVehicleTracking] = useState(null);

    const handleChooseColor = (percent) => {
        if (percent < 0.5) {
            return '#008000';
        } else if (percent >= 0.5 && percent < 0.8) {
            return '#ffa500';
        } else return '#ff0000';
    }

    const handleSetStatus = (percent) => {
        if (percent < 0.5) {
            return styles.goodStatus;
        } else if (percent >= 0.5 && percent < 0.8) {
            return styles.normalStatus;
        } else return styles.dangerStatus;
    }

    const handleChooseTruck = (truckInfo) => {
        if (truckInfo.status === VehicleStatus.AVAILABLE || truckInfo.type === VehicleType.INNER) {
            localStorage.setItem('activeTruck', JSON.stringify(truckInfo));
            navigate(`/load-order?truckId=${truckInfo?._id}`, {state: {truckInfo}});
        } else if (truckInfo.status === VehicleStatus.IN_PROGRESS) {
            dispatch(getVehicleOrderLists({vehicle_id: truckInfo._id }));
            setVehicleTracking(truckInfo);
        }
    }

    const findAreaLable = (code) => {
        return AreaDelivery.find(el => el.code === code)?.label;
    }

    const getVehicleStatus = (status) => {
        return VehicleStatuses.find(el => el?.value === status)?.label;
    }

    const getVehicleType = type => {
        return VehicleTypes.find(el => el?.value === type)?.label;
    }

    const getVehicleStatusIcon = (status) => {
        return status === VehicleStatus.AVAILABLE 
            ? <BsCheck2Circle />
            : status === VehicleStatus.IN_PROGRESS
                ? <FiLoader />
                : <CiCircleMore />
    }

    const getTotalOrderWeight = () => {
        return vehicleOrders?.reduce((acc, cur) => acc + cur.weight, 0);
    }

    useEffect(() => {
        if (vehicles.length > 0) {
            setAvailVehicle(vehicles.filter(vehicle => vehicle.type === selectedTab.field));
        }
    }, [selectedTab, vehicles]);

    useEffect(() => {
        dispatch(getStockVehicles(user.stock_id));
    }, []);

    return (
        <div className={styles.wrapper}>
            <StockerHeader title="Xuất kho" openImportPopup={() => setToggleImportPopup(true)} />

            <div className="row">
                <Tabs tabs={tabs} changeTab={setSelectedTab} selectedTab={selectedTab} />
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="d-flex align-items-center justify-content-between">
                        <span className='fs-5 fw-semibold'>Chọn xe tải</span>
                    </div>
                </div>
            </div>

            <div className="row mt-3">
                {availVehicle.map((route, index) => (
                    <div className="col-12 col-lg-4 mb-3 mb-sm-4" key={route._id} onClick={() => handleChooseTruck(route)}>
                        <div className={styles.blockItem}>
                            <div className="d-flex justify-content-between h-100">
                                <div className="d-flex flex-column justify-content-between w-50">
                                    {selectedTab.field === 'inner' ? (
                                        <span className={styles.label}>{`${findAreaLable(route?.from)} ${index+1}`}</span>
                                    ) : (
                                        <span className={styles.label}>{route.from_string} - {route.to_string}</span>
                                    )}
                                    <span className='mt-2'>Khả dụng, Kg:</span>
                                    <span className={styles.status}>
                                        <span className='fw-semibold'>{route.max_weight - route.current_weight}</span>
                                        /{route.max_weight}
                                    </span>
                                    <span>Mã xe: <span className='fw-semibold'>{route.license_plate_number}</span></span>
                                    {route.type !== VehicleType.INNER && (
                                        <span className={`${styles.currentStatus} ${styles[route.status]}`}>
                                            {getVehicleStatusIcon(route.status)}
                                            <span className='ms-1'>{getVehicleStatus(route.status)}</span>
                                        </span>
                                    )}
                                    {/* <span>Tài xế: <span className='fw-semibold'>{route?.driver_id}</span></span> */}
                                </div>
                                <div className="d-flex flex-column align-items-end w-50">
                                    <h1 className={handleSetStatus(route.current_weight / route.max_weight)}>{((route.current_weight / route.max_weight)*100).toFixed(2)}%</h1>
                                    {/* Truck image */}
                                    <TruckIcon 
                                        width="95%" 
                                        height="100%"
                                        availability={route.current_weight / route.max_weight}
                                        color={handleChooseColor(route.current_weight/ route.max_weight)} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {toggleImportPopup && (
                <GeneralConfirm
                    title="Thêm đơn hàng mới vào kho"
                    message={<ImportOrder closePopup={() => setToggleImportPopup(false)} />}
                    disableCancel={true}
                />
            )}

            {vehicleTracking && (
                <div className="tracking-items">
                    <div className="container">
                        <div className="header">
                            <span className='title'>Thông tin vận chuyển</span>
                            <button className='close-btn' onClick={() => setVehicleTracking(null)}> <FaTimes /> </button>
                        </div>
                        <div className="body">
                            <div className={styles.vehicleTracking}>
                                <div className={styles.vehicleInfo}>
                                    <span>Mã xe tải: <span className='fw-600'>{vehicleTracking._id}</span></span>
                                    <span>Biển số xe: <span className='fw-600'>{vehicleTracking?.license_plate_number}</span></span>
                                    <span>Loại xe: <span className='fw-600'>{getVehicleType(vehicleTracking?.type)}</span></span>
                                </div>
                                <div className={styles.timeline}>
                                    {vehicleTracking.deliveryStatus.map((row, index) => (
                                        <div key={index}
                                            className={`
                                                ${styles.point}
                                                ${index !== vehicleTracking.deliveryStatus.length - 1 ? styles.notLastPoint : ''}
                                                ${row.traversed ? styles.active : ''}
                                            `
                                        }>
                                            <div className={`${styles.status} ${row?.traversed ? styles.active : ''}`}>
                                                <BiCheck />
                                            </div>
                                            <div className={styles.info}>
                                                <span className='fw-600'>{row.stock_id.name}</span>
                                                <span className='fs-12'>01-10-2023 16:53:54</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.vehicleOrders}>
                                <div className="d-flex-center justify-content-between mb-3">
                                    <span className='fs-18 fw-600'>Thông tin đơn hàng</span>
                                    <span>{vehicleOrders.length} đơn hàng / {getTotalOrderWeight()}kg</span>
                                </div>
                                <table className={styles.vehicleOrdersTable}>
                                    <thead>
                                        <tr>
                                            <th>Mã đơn hàng</th>
                                            <th>Người gửi</th>
                                            <th>Khối lượng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vehicleOrders?.map((item) => (
                                            <tr key={item._id}>
                                                <td> {item._id} </td>
                                                <td> {item.sender_name} </td>
                                                <td> {item.weight} kg </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ExportOrder;
