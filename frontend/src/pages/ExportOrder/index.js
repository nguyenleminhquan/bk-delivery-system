import styles from './ExportOrder.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { BiPencil } from 'react-icons/bi'
import { TbFileExport } from 'react-icons/tb'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { TruckIcon } from 'components/Icons';
import { getVehicleByRegion, getVehicleByRoute, getVehicles } from 'features/delivery/deliverySlice';
import ConfirmPopup from 'components/ConfirmPopup';
import ImportOrder from 'components/ImportOrder';

/** Dựa vào địa điểm làm việc của stocker, khi xuất kho sẽ hiển thị các xe tải phù hợp:
 * VD: - Stocker ở kho tổng Hồ Chí Minh -> hiển thị các xe tải về các tỉnh
 *     - Stocker ở kho tỉnh -> hiển thị các xe tải về kho tổng Hồ Chí Minh   
 */
const routeModels = {
    source: '',
    destination: '',
    label: 'Tất cả'
}
/** Truck info:
 * 0 <= available < 50% -> #008000 (Green)
 * 50% <= available < 80% -> #ffa500 (Yellow)
 * 80% <= available < 100% -> #ff0000 (Red)
 */
function ExportOrder() {
    const { vehicles } = useSelector(state => state.delivery);
    const { user } = useSelector(state => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [routeFilters,  setRouteFilters] = useState([routeModels]);
    const [selectedRouteFilter, setSelectedRouteFilter] = useState(routeFilters[0].label);
    const [toggleImportPopup, setToggleImportPopup] = useState(false);

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
        localStorage.setItem('activeTruck', JSON.stringify(truckInfo));
        navigate(`/load-order?truckId=${truckInfo?._id}`, {state: {truckInfo}});
    }

    // Filter
    useEffect(() => {
        // call api get truck route by route -> set state for truck route
        if (selectedRouteFilter === 'Tất cả' && user) {
            dispatch(getVehicleByRegion(user?.area_code));
        } else {
            const selectedRoute = routeFilters.find(route => route.label === selectedRouteFilter);
            dispatch(getVehicleByRoute({ from: selectedRoute.source, to: selectedRoute.destination }));
        }
    }, [selectedRouteFilter]);

    function generateVehicleFilter() {
        const filters = vehicles.map(vehicle => ({
            source: vehicle.from,
            destination: vehicle.to,
            label: `${vehicle.from_string} - ${vehicle.to_string}`
        }));
        // Filtered filter data
        const uniqueFilters = filters.filter((value, index) => {
            const _value = JSON.stringify(value);
            return index === filters.findIndex(obj => {
              return JSON.stringify(obj) === _value;
            });
        });
        setRouteFilters(prev => [routeModels, ...uniqueFilters]);
    }

    useEffect(() => {
        if (vehicles) {
            generateVehicleFilter();
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
            <div className="row mt-5">
                <div className="col-12">
                    <div className="d-flex align-items-center justify-content-between">
                        <span className='fs-5 fw-semibold'>Chọn xe tải</span>
                        <div className={styles.selectFilter}>
                            <label className='fs-6 me-3'>Tuyến</label>
                            <select value={selectedRouteFilter}
                                onChange={e => setSelectedRouteFilter(e.target.value)}>
                                {routeFilters.map((route, index) => (
                                    <option value={route.label} key={index}>{route.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mt-3">
                {vehicles.map(route => (
                    <div className="col-4 mb-4" key={route._id} onClick={() => handleChooseTruck(route)}>
                        <div className={styles.blockItem}>
                            <div className="d-flex">
                                <div className="d-flex flex-column">
                                    <span className={styles.label}>{route.from_string} - {route.to_string}</span>
                                    <span className='mt-2'>Khả dụng, Kg:</span>
                                    <span className={styles.status}>
                                        <span className='fw-semibold'>{route.max_weight - route.current_weight}</span>
                                        /{route.max_weight}
                                    </span>
                                    <span>Mã xe: <span className='fw-semibold'>{route.license_plate_number}</span></span>
                                    <span>Tài xế: <span className='fw-semibold'>{route?.driver_id}</span></span>
                                </div>
                                <div className="d-flex flex-column align-items-end">
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
                <ConfirmPopup
                    title="Thêm đơn hàng mới vào kho"
                    content={<ImportOrder />}
                    actionNo={() => setToggleImportPopup(false)}
                    cancelLabel="Hủy bỏ"
                />
            )}
        </div>
    );
}

export default ExportOrder;