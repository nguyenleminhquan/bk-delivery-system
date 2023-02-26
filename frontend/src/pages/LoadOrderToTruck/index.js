import { useLocation } from 'react-router-dom';
import styles from './LoadOrderToTruck.module.scss'
import { Link } from 'react-router-dom';
import { TbFileExport } from 'react-icons/tb';
import { BiPencil, BiPackage } from 'react-icons/bi';
import { TbTruckDelivery } from 'react-icons/tb';
import { TruckIcon } from 'components/Icons';
import {useState, useEffect} from 'react';

const orderModels = [
    {
        id: 123123123,
        weight: 300,
    },
    {
        id: 234234234,
        weight: 300,
    },
    {
        id: 823979879,
        weight: 300,
    }
]

function LoadOrderToTruck() {
    const location = useLocation();
    const {truckInfo} = location.state;
    const [truckAvailable, setTruckAvailable] = useState(truckInfo.availability);

    const [orders, setOrders] = useState(() => orderModels.map(order => ({...order, checked: false})));
    const [selected, setSelected] = useState(0);
    const [totalWeight, setTotalWeight] = useState(0);
    const [toggleAll, setToggleAll] = useState(false);
    const [truckLoad, setTruckLoad] = useState([]);

    const handleLoadOrder = (order, e) => {
        const updated = orders.map(item => {
            if (item.id === order.id) {
                return {...item, checked: !item.checked}
            } else return item;
        })
        setOrders(updated);  
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
            setTruckLoad([]);
        } else {
            setTruckAvailable(truckAvailable - totalClickedWeight);
            // Update order list (remove) after load order to truck
            setOrders(updateOrderList());
            setTotalWeight(0);
            setSelected(0);
        }
    }

    const updateOrderList = () => {
        const intersection = truckLoad.filter(item => orders.includes(item));
        return orders.filter(item => !intersection.includes(item));
    }

    const handleOpenTruckOrders = () => {
        console.log(truckLoad);
    }

    const handleToggleAll = e => {
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
                        <span className={styles.truckLabel}>{truckInfo.label}, {truckInfo.id}</span>
                    </div>
                </div>
                <div className="row mt-2 ">
                    <div className="col-5">
                        <div className={styles.leftCol}>
                            <div className={styles.title}>Truck Load</div>
                            <div className={handleSetStatus((truckInfo.net - truckAvailable) / truckInfo.net)}>{((truckInfo.net - truckAvailable) / truckInfo.net)*100}%</div>
                            <div className="my-5">
                                <TruckIcon 
                                    width="80%"
                                    height="100%" 
                                    availability={(truckInfo.net - truckAvailable) / truckInfo.net}
                                    color={handleChooseColor((truckInfo.net - truckAvailable)/ truckInfo.net)}
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

                            <table className='mt-3'>
                                <thead>
                                    <tr>
                                        <th><input type="checkbox" onChange={handleToggleAll}/></th>
                                        <th>Mã đơn hàng</th>
                                        <th>Khối lượng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order.id}>
                                            <td><input type="checkbox"
                                                checked={order.checked}
                                                onChange={e => handleLoadOrder(order, e)}
                                            /></td>
                                            <td>{order.id}</td>
                                            <td>{order.weight}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <button className='mt-2 p-3' onClick={handleAddToTruck}>Import to truck</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoadOrderToTruck;

