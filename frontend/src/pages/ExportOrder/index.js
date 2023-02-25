import styles from './ExportOrder.module.scss';
import { Link } from 'react-router-dom';
import { BiPencil } from 'react-icons/bi'
import { TbFileExport } from 'react-icons/tb'
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { TruckIcon } from 'components/Icons';

/** Dựa vào địa điểm làm việc của stocker, khi xuất kho sẽ hiển thị các xe tải phù hợp:
 * VD: - Stocker ở kho tổng Hồ Chí Minh -> hiển thị các xe tải về các tỉnh
 *     - Stocker ở kho tỉnh -> hiển thị các xe tải về kho tổng Hồ Chí Minh   
 */
const routeModels = [
    {
        source: '',
        destination: '',
        label: 'Tất cả'
    },
    {
        source: 'hochiminh',
        destination: 'soctrang',
        label: 'HCM - Sóc Trăng'
    },
    {
        source: 'hochiminh',
        destination: 'tiengiang',
        label: 'HCM - Tiền Giang'
    },
    {
        source: 'hochiminh',
        destination: 'daklak',
        label: 'HCM - Đắk Lắk'
    }
]

const truckRoutesModels = [
    {
        id: 'SGST1',
        source: 'hochiminh',
        destination: 'soctrang',
        label: 'HCM - Sóc Trăng',
        net: 1000,
        driver: 'Nguyễn Văn A',
        availability: 100,
    },
    {
        id: 'SGST2',
        source: 'hochiminh',
        destination: 'soctrang',
        label: 'HCM - Sóc Trăng',
        net: 1000,
        driver: 'Nguyễn Văn B',
        availability: 500,
    },
    {
        id: 'SGTG1',
        source: 'hochiminh',
        destination: 'tiengiang',
        label: 'HCM - Tiền Giang',
        net: 1000,
        driver: 'Trần Văn A',
        availability: 700,
    }
]

/** Truck info:
 * 0 <= available < 50% -> #008000 (Green)
 * 50% <= available < 80% -> #ffa500 (Yellow)
 * 80% <= available < 100% -> #ff0000 (Red)
 */

function ExportOrder() {
    // const { user } = useSelector(state => state.user);
    const [truckRoutes, setTruckRoutes] = useState(truckRoutesModels);
    const [routeFilters,  setRouteFilters] = useState(routeModels);
    const [selectedRouteFilter, setSelectedRouteFilter] = useState(routeFilters[0].label);

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

    useEffect(() => {
        // call api get truck route by route -> set state for truck route
        setTruckRoutes(() => {
            if (selectedRouteFilter === 'Tất cả') {
                return truckRoutesModels
            } else {
                return truckRoutesModels.filter(route => route.label === selectedRouteFilter)
            }
        });
    }, [selectedRouteFilter])

    useEffect(() => {
        // Get truck routes by stocker location -> compare stocker location with source field
    }, []);

    return (
        <div className={styles.wrapper}>
            <div className="container">
                <div className="row">
                    <header className='d-flex justify-content-between align-items-center'>
                        <h2 className='fs-1'>Xuất kho</h2>
                        <div className={styles.action}>
                            <Link className={`btn ${styles.customBtn}`} to="/">
                                <TbFileExport className='me-3'/> Xuất Excel
                            </Link>

                            <Link className={`btn ${styles.customBtn} ${styles.active}`} to="/export-order">
                                <BiPencil className='me-3'/> Xuất Kho
                            </Link>

                            <Link className={`btn ${styles.customBtn}`} to="/create-order">
                                <BiPencil className='me-3'/> Nhập Kho
                            </Link>
                        </div>
                    </header>

                </div>
                <div className="row mt-5">
                    <div className="col-12">
                        <div className="d-flex align-items-center justify-content-between">
                            <h2 className='fs-2'>Chọn xe tải</h2>
                            <div className={styles.selectFilter}>
                                <label className='me-3'>Tuyến</label>
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
                    {truckRoutes.map(route => (
                        <div className="col-4 mb-4" key={route.id}>
                            <div className={styles.blockItem}>
                                <div className="d-flex">
                                    <div className="d-flex flex-column w-50">
                                        <h3>{route.label}</h3>
                                        <span className='mt-2'>Khả dụng, Kg:</span>
                                        <span className='fw-light fs-1'><span className='fw-semibold'>{route.availability}</span>/{route.net}</span>
                                        <span>Mã xe: <span className='fw-semibold'>{route.id}</span></span>
                                        <span>Tài xế: <span className='fw-semibold'>{route.driver}</span></span>
                                    </div>
                                    <div className="d-flex flex-column align-items-end w-50">
                                        <h1 className={handleSetStatus((route.net - route.availability) / route.net)}>{((route.net - route.availability) / route.net)*100}%</h1>
                                        {/* Truck image */}
                                        <TruckIcon 
                                            width="95%" 
                                            height=""
                                            availability={(route.net - route.availability) / route.net}
                                            color={handleChooseColor((route.net - route.availability)/ route.net)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ExportOrder;