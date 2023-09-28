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
import { AreaDelivery } from 'utils/consts';

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
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [selectedTab, setSelectedTab] = useState(tabs[0]);
    const [availVehicle, setAvailVehicle] = useState([]);
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

    const findAreaLable = (code) => {
        return AreaDelivery.find(el => el.code === code)?.label;
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
                            <div className="d-flex justify-content-between">
                                <div className="d-flex flex-column w-50">
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
        </div>
    );
}

export default ExportOrder;