import {useState, useEffect, useContext} from 'react';
import {MdOutlineDonutSmall} from 'react-icons/md'
import styles from './Driver.module.scss'
import ConfirmPopup from 'components/ConfirmPopup';
import WorkCheckIn from 'components/WorkCheckIn';
import DeliveryOrder from 'components/DeliveryOrder';
import { useDispatch, useSelector } from 'react-redux';
import { acceptDelivery, updateDeliveryStatus } from 'features/delivery/deliverySlice';
import { SocketContext } from 'index';
import { toast } from 'react-toastify';

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
  const [ allDeliveries, setAllDeliveries ] = useState([]);
  const [ deliveries, setDeliveries ] = useState([]);
  const [ configDeliveries, setConfigDeliveries ] = useState([])
  const { user } = useSelector((state) => state.user)
  let deliveryType = user.typeUser === 'driver_inner' ? 'inner' : 'inter';
  const socket = useContext(SocketContext);
  const dispatch = useDispatch();
  
  const handleTracking = () => {
    console.log('Chúc mừng bạn đã điểm danh thành công');
    // Cakk api for work-tracking...
  }

  const btns = {
    accept: (id) => {
      return {
        id: 'accept',
        text: 'Nhận đơn',
        action: () => {
          socket.emit('acceptDelivery', {
            driver_id: user.id,
            delivery_id: id
          })
          // dispatch(acceptDelivery({ driver_id: user.id, delivery_id: id }))
        }
      }
    },
    viewOrder: () => {
      return {
        id: 'viewOrder',
        text: 'Xem đơn hàng',
        action: () => alert('Xem đơn')
      }
    },
    picked: (id) => {
      return {
        id: 'picked',
        text: 'Đã lấy hàng',
        action: () => {
          socket.emit('updateDeliveryStatus', {
            delivery_id: id,
            status: 'picked'
          })
          // dispatch(updateDeliveryStatus({ delivery_id: id, status: 'picked' }))
        }
      }
    },
    deliveried: (id) => {
      return {
        id: 'deliveried',
        text: 'Đã giao xong',
        action: () => {
          socket.emit('updateDeliveryStatus', {
            delivery_id: id,
            status: 'deliveried'
          })
          // dispatch(updateDeliveryStatus({ delivery_id: id, status: 'deliveried' }))
        }
      }
    }
  }

  useEffect(() => {
    socket.emit('allDeliveries', {
      area_code: user.area_code,
      type: deliveryType
    })
  }, [])

  useEffect(() => {
    socket.on('allDeliveries', (data) => {
      setAllDeliveries(data);
    })
    socket.on('newDelivery', (data) => {
      setAllDeliveries([...allDeliveries, data])
    })
    socket.on('updatedDelivery', (data) => {
      const tempDeliveries = JSON.parse(JSON.stringify(allDeliveries));
      tempDeliveries.forEach((item) => {
        if (item._id === data._id) {
          item.status = data.status
        }
      })
      setAllDeliveries(tempDeliveries);
    })
  }, [socket, allDeliveries])

  useEffect(() => {
    if (selectedTab.field === 'waiting') {
      setDeliveries(allDeliveries.filter((item) => item.status === 'waiting' && item.area_code === user.area_code && item.type === deliveryType))
    }
    if (selectedTab.field === 'accepted') {
      setDeliveries(allDeliveries.filter((item) => item.status === 'accepted' && item.area_code === user.area_code && item.type === deliveryType))
    }
    if (selectedTab.field === 'picked') {
      setDeliveries(allDeliveries.filter((item) => item.status === 'picked' && item.area_code === user.area_code && item.type === deliveryType))
    }
  }, [selectedTab, allDeliveries])

  useEffect(() => {
    const { accept, viewOrder, picked, deliveried } = btns;
    let tempDeliveries = JSON.parse(JSON.stringify(deliveries));
    if (selectedTab.field === 'waiting') {
      tempDeliveries.forEach((item) => { item.btns = [accept(item._id), viewOrder()] })
    }
    if (selectedTab.field === 'accepted') {
      tempDeliveries.forEach((item) => { item.btns = [picked(item._id), viewOrder()] })
    }
    if (selectedTab.field === 'picked') {
      tempDeliveries.forEach((item) => { item.btns = [deliveried(item._id), viewOrder()] })
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