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
import ViewOrderInfo from 'components/ViewOrderInfo';
import { checkInDay } from 'features/user/userSlice';

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
  const dispatch = useDispatch();
  const [toggleCheckinPopup, setToggleCheckinPopup] = useState(false);
  const [toggleViewOrderPopup, setToggleViewOrderPopup] = useState(false);
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const [ allDeliveries, setAllDeliveries ] = useState([]);
  const [ deliveries, setDeliveries ] = useState([]);
  const [ configDeliveries, setConfigDeliveries ] = useState([])
  const [orderInfo, setOrderInfo] = useState('')
  const { user } = useSelector((state) => state.user)
  let deliveryType = user.typeUser === 'driver_inner' ? 'inner' : 'inter';
  const socket = useContext(SocketContext);
  
  const handleTracking = () => {
    console.log('Chúc mừng bạn đã điểm danh thành công');
    // Cakk api for work-tracking...
    const now = Date.now();
    dispatch(checkInDay(now));
    setToggleCheckinPopup(false);
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
    viewOrder: (delivery) => {
      const { order } = delivery;
      const { items } = order;
      const orderPopop = {
        sender_address: order.sender_address,
        receiver_address: order.receiver_address,
        quantity: items.length,
        weight: order.weight,
        items: items
      }
      return {
        id: 'viewOrder',
        text: 'Xem đơn hàng',
        action: () => {
          setToggleViewOrderPopup(true)
          setOrderInfo(orderPopop)
        }
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
      console.log('allDeliveries', data)
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
    console.log('deliveries', deliveries)
    const { accept, viewOrder, picked, deliveried } = btns;
    let tempDeliveries = JSON.parse(JSON.stringify(deliveries));
    if (selectedTab.field === 'waiting') {
      tempDeliveries.forEach((item) => { item.btns = [accept(item._id), viewOrder(item)] })
    }
    if (selectedTab.field === 'accepted') {
      tempDeliveries.forEach((item) => { item.btns = [picked(item._id), viewOrder(item)] })
    }
    if (selectedTab.field === 'picked') {
      tempDeliveries.forEach((item) => { item.btns = [deliveried(item._id), viewOrder(item)] })
    }
    setConfigDeliveries(tempDeliveries)
  }, [deliveries])

  return (
    <div className={styles.wrapper}>
      <div className='checkinBtn' onClick={() => setToggleCheckinPopup(true)}>
        <MdOutlineDonutSmall />
      </div>
      {toggleCheckinPopup && (
        <ConfirmPopup 
          title="Check in hôm nay"
          content={<WorkCheckIn />}
          actionNo={() => setToggleCheckinPopup(false)}
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
            toggleViewOrderPopup={toggleViewOrderPopup}
            closePopup={() => setToggleViewOrderPopup(false)}
          />
        ))}
      </div>

      {toggleViewOrderPopup && (
				<ConfirmPopup 
					title='Thông tin đơn hàng'
					content={<ViewOrderInfo orderInfo={orderInfo} />}
					actionNo={() => setToggleViewOrderPopup(false)}
					cancelLabel="Đóng lại"
				/>
			)}	

    </div>
  )
}

export default DriverHome