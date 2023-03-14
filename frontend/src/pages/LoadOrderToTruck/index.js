import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { TbFileExport } from 'react-icons/tb';
import { BiPencil, BiPackage } from 'react-icons/bi';
import { TbTruckDelivery } from 'react-icons/tb';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { TruckIcon } from 'components/Icons';
import {useState, useEffect} from 'react';
import styles from './LoadOrderToTruck.module.scss'
import ConfirmPopup from 'components/ConfirmPopup';

const orderModels = [
    {
        id: 781263,
        weight: 123,
    },
    {
        id: 87123,
        weight: 234,
    },
    {
        id: 8713145,
        weight: 283,
    },
    {
        id: 123123123,
        weight: 134,
    },
    {
        id: 182371823,
        weight: 594,
    },
    {
        id: 19823,
        weight: 895,
    },
    {
        id: 1343154,
        weight: 345,
    },
    {
        id: 940123,
        weight: 857,
    },
    {
        id: 123456,
        weight: 938,
    },
    {
        id: 654345,
        weight: 453,
    },
    {
        id: 234234,
        weight: 300,
    },
    {
        id: 456765,
        weight: 847,
    }
]

const ConfirmOrderLists = ({orders}) => {
    const [toggleFilter, setToggleFilter] = useState(false);
    
    const handleSortCol = () => {
        /**
         * order (true) -> sort asc
         * order (false) ->  sort desc
         */
        if (!toggleFilter) {
            orders.sort((a, b) => a.weight - b.weight);
        } else {
            orders.sort((a, b) => b.weight - a.weight);
        }
        setToggleFilter(!toggleFilter);
    }

    const handleDeleteOrder = () => {
        
    }

    return (
        <div className={styles.customTableWrap}>
            <div className={styles.customTable}>
                <div className={`row p-2 ${styles.ordersHeader}`}>
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
                    <div className="col-1"></div>
                </div>
                <div className={styles.ordersWrap}>
                    {orders.map(order => (
                        <div className={`row p-2 ${styles.ordersRow}`} key={order.id}>
                            <div className="col-6">{order.id}</div>
                            <div className="col-5">{order.weight}</div>
                            <div className="col-1">
                                <div className={styles.deleteBtn} onClick={handleDeleteOrder}><RiDeleteBin6Fill /></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function LoadOrderToTruck() {
    const location = useLocation();
    const {truckInfo} = location.state;
    const [truckAvailable, setTruckAvailable] = useState(truckInfo.max_weight - truckInfo.current_weight);

    const [orders, setOrders] = useState(() => orderModels.map(order => ({...order, checked: false})));
    const [selected, setSelected] = useState(0);
    const [totalWeight, setTotalWeight] = useState(0);
    const [toggleAll, setToggleAll] = useState(false);
    const [truckLoad, setTruckLoad] = useState([]);

    const [toggleFilter, setToggleFilter] = useState(false);
    const [openPopup, setOpenPopup] = useState(false);

    const handleLoadOrder = (order, e) => {
        const currentWeight = truckLoad.reduce((acc, cur) => acc + cur.weight, 0);
        const updated = orders.map(item => {
            if (item.id === order.id) {
                return {...item, checked: !item.checked}
            } else return item;
        })
        setOrders(updated);
        setToggleAll(isAllChecked(updated));
        if (e.target.checked) {
            setTruckLoad(prev => [...prev, order]);
            setSelected(prev => prev + 1);
            setTotalWeight(prev => prev + order.weight);
        } else {
            // remove order from truckLoad
            const orderIndex = truckLoad.findIndex(item => item.id === order.id);
            setTruckLoad([...truckLoad.slice(0, orderIndex), ...truckLoad.slice(orderIndex+1)]);
            setSelected(prev => prev - 1);
            setTotalWeight(prev => prev - order.weight);
        }
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
            setTruckAvailable(truckAvailable - totalClickedWeight);
            // Update order list (remove) after load order to truck
            setOrders(updateOrderList());
            setTotalWeight(0);
            setSelected(0);

        }
    }

    const updateOrderList = () => {
        return orders.filter(item => !truckLoad.map(order => order.id).includes(item.id));
    }

    const handleOpenTruckOrders = () => {
        console.log(truckLoad);
        setOpenPopup(true);
    }

    const handleToggleAll = e => {
        setToggleAll(!toggleAll);
        if (e.target.checked) {
            setOrders(prev => prev.map(item => ({...item, checked: true})));
            setTruckLoad(orders);
            setTotalWeight(orders.reduce((acc, cur) => acc + cur.weight, 0));
            setSelected(orders.length);
        } else {
            setOrders(prev => prev.map(item => ({...item, checked: false})));
            setTruckLoad([]);
            setTotalWeight(0);
            setSelected(0);
        }
    }

    const isAllChecked = orders => {
        return orders.every(order => order.checked);
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

    useEffect(() => {
        console.log(truckInfo);
    }, [])

    useEffect(() => {
        console.log(truckLoad);
    }, [truckLoad])

    return (
        <div className={styles.wrapper}>
            <div className="container">
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

                            <Link className={`btn ${styles.customBtn}`} to="/create-order">
                                <BiPencil className='me-3'/> Nhập Kho
                            </Link>
                        </div>
                    </header>
                </div>
                <div className="row mt-3">
                    <div className="col-12">
                        <span className={styles.truckLabel}>{truckInfo.from} - {truckInfo.to}, {truckInfo.license_plate_number}</span>
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-5">
                        <div className={styles.leftCol}>
                            <div className={styles.title}>Truck Load</div>
                            <div className={handleSetStatus(truckInfo.current_weight / truckInfo.max_weight)}>{(truckInfo.current_weight / truckInfo.max_weight)*100}%</div>
                            <div className="my-5">
                                <TruckIcon 
                                    width="80%"
                                    height="100%" 
                                    availability={truckInfo.current_weight / truckInfo.max_weight}
                                    color={handleChooseColor(truckInfo.current_weight / truckInfo.max_weight)}
                                />
                            </div>
                            <div className={styles.action}>
                                <button className='btn customBtn m-0 mb-2'
                                    onClick={handleOpenTruckOrders}>
                                    <BiPackage className='me-2'/>
                                    Danh sách đơn hàng</button>
                                <button className='btn customBtn active m-0'>
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
                                        <div className='col-1'><input type="checkbox" checked={toggleAll} onChange={handleToggleAll}/></div>
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
                                        {orders.map(order => (
                                            <div className={`row p-2 ${styles.ordersRow}`} key={order.id}>
                                                <div className='col-1'><input type="checkbox"
                                                    checked={order.checked}
                                                    onChange={e => handleLoadOrder(order, e)}
                                                /></div>
                                                <div className="col-6">{order.id}</div>
                                                <div className="col-5">{order.weight}</div>
                                            </div>
                                        ))}

                                    </div>
                                </div>

                            </div>
                            <button className='mt-2 p-2' onClick={handleAddToTruck}>Import to truck</button>
                        </div>
                    </div>
                </div>
            </div>

            {openPopup && (
                <ConfirmPopup title="Danh sách đơn hàng"
                    content={<ConfirmOrderLists orders={truckLoad}/>}
                    okLabel="OK"
                    actionYes={() => setOpenPopup(false)}
                />
            )}                
        </div>
    );
}

export default LoadOrderToTruck;

