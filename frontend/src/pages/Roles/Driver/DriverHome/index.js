import {useState, useEffect} from 'react';
import {MdOutlineDonutSmall} from 'react-icons/md'
import styles from './Driver.module.scss'
import ConfirmPopup from 'components/ConfirmPopup';
import WorkCheckIn from 'components/WorkCheckIn';
import DeliveryOrder from 'components/DeliveryOrder';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDelivery } from 'features/delivery/deliverySlice';

const tabs = [
  {
    field: 'waiting',
    name: 'Đơn được gán',
  },
  {
    field: 'accepted',
    name: 'Đã nhận đơn',
  },
  {
    field: 'picked',
    name: 'Đã lấy hàng',
  }
]


function DriverHome() {
  const [togglePopup, setTogglePoup] = useState(false);
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  // const [deliveries, setDeliveries] = useState([]);
  const { deliveries } = useSelector((state) => state.delivery)
  const { user } = useSelector((state) => state.user)
  const [ configDeliveries, setConfigDeliveries ] = useState([])
  const dispatch = useDispatch();
  
  const handleTracking = () => {
    console.log('Chúc mừng bạn đã điểm danh thành công');
    // Cakk api for work-tracking...
  }

  const btns = {
    accept: () => {
      return {
        id: 'accept',
        text: 'Nhận đơn',
        action: () => alert('Đã nhận đơn')
      }
    },
    viewOrder: () => {
      return {
        id: 'viewOrder',
        text: 'Xem đơn hàng',
        action: () => alert('Xem đơn')
      }
    },
    picked: () => {
      return {
        id: 'picked',
        text: 'Đã lấy hàng',
        action: () => alert('Đã lấy hàng')
      }
    },
    deliveried: () => {
      return {
        id: 'deliveried',
        text: 'Đã giao xong',
        action: () => alert('Đã giao')
      }
    }
  }

  useEffect(() => {
    let deliveryType = user.typeUser === 'driver_inner' ? 'inner' : 'inter';
    if (selectedTab.field === 'waiting') {
      dispatch(getOrderDelivery({ status: 'waiting', area_code: user.area_code, type: deliveryType }))
    }
    if (selectedTab.field === 'accepted') {
      dispatch(getOrderDelivery({ status: 'accepted', area_code: user.area_code, type: deliveryType }))
    }
    if (selectedTab.field === 'picked') {
      dispatch(getOrderDelivery({ status: 'picked', area_code: user.area_code, type: deliveryType }))
    }
  }, [selectedTab])

  useEffect(() => {
    const { accept, viewOrder, picked, deliveried } = btns;
    let tempDeliveries = JSON.parse(JSON.stringify(deliveries));
    if (selectedTab.field === 'waiting') {
      tempDeliveries.forEach((item) => { item.btns = [accept(), viewOrder()] })
    }
    if (selectedTab.field === 'accepted') {
      tempDeliveries.forEach((item) => { item.btns = [picked(), viewOrder()] })
    }
    if (selectedTab.field === 'deliveried') {
      tempDeliveries.forEach((item) => { item.btns = [deliveried(), viewOrder()] })
    }
    setConfigDeliveries(tempDeliveries)
  }, [deliveries])

  return (
    <div className={styles.wrapper}>
      <div className='checkinBtn' onClick={() => setTogglePoup(!togglePopup)}>
        <MdOutlineDonutSmall />
      </div>
      {togglePopup && (
        <ConfirmPopup 
          title="Check in hôm nay"
          content={<WorkCheckIn />}
          actionNo={() => setTogglePoup(false)}
          actionYes={() => handleTracking()}
          cancelLabel="Đóng lại"
          okLabel="Check-in"
      />
      )}
      <h2 className='pb-3 fs-3'>Đơn hàng thực hiện</h2>
      
      <ul className={styles.tabHeader}>
        {tabs.map(tab => (
          <li key={tab.name} 
            className={selectedTab.field === tab.field ? `${styles.tabHeaderItem} ${styles.active}` : `${styles.tabHeaderItem}`}
            onClick={() => setSelectedTab(tab)}
          >{tab.name}</li>
        ))}
      </ul>

      <div className={styles.deliveryList}>
        {configDeliveries.map((delivery) => (
          <DeliveryOrder
            key={delivery._id}
            delivery={delivery}
          />
        ))}
      </div>

    </div>
  )
}

export default DriverHome