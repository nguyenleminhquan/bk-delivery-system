import {useState, useEffect, useContext} from 'react';
import {MdOutlineDonutSmall} from 'react-icons/md'
import ConfirmPopup from 'components/ConfirmPopup';
import WorkCheckIn from 'components/WorkCheckIn';
import DeliveryOrder from 'components/DeliveryOrder';
import { useDispatch, useSelector } from 'react-redux';
import { acceptDelivery, getAllDelivery, updateDeliveryStatus } from 'features/delivery/deliverySlice';
import { SocketContext } from 'index';
import { toast } from 'react-toastify';
import ViewOrderInfo from 'components/ViewOrderInfo';
import { checkInDay } from 'features/user/userSlice';
import Tabs from 'components/Tabs';
import { FaCheck } from 'react-icons/fa';
import './index.scss'
import customFetch from 'services/axios';

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
  },
  {
    field: 'deliveried',
    name: 'Đang có trong xe'
  }
]


function DriverHome() {
  const dispatch = useDispatch();
  const [toggleCheckinPopup, setToggleCheckinPopup] = useState(false);
  const [toggleViewOrderPopup, setToggleViewOrderPopup] = useState(false);
  const [toggleAllPopup, setToggleAllPopup] = useState(false);
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const [ allDeliveries, setAllDeliveries ] = useState([]);
  const [ deliveriesByStatus, setDeliveriesByStatus ] = useState([]);
  const [ configDeliveries, setConfigDeliveries ] = useState([])
  const [orderInfo, setOrderInfo] = useState('')
  const { user } = useSelector((state) => state.user)
  const { deliveries } = useSelector((state) => state.delivery)
  const socket = useContext(SocketContext);
  
  const handleTracking = () => {
    console.log('Chúc mừng bạn đã điểm danh thành công');
    // Cakk api for work-tracking...
    const now = Date.now();
    dispatch(checkInDay(now));
    setToggleCheckinPopup(false);
  }

  const handleAllAction = (deliveries) => {
    if (selectedTab.field === 'waiting') {
      deliveries.forEach((delivery) => {
        btns.accept(delivery).action();
      })
    } else if (selectedTab.field === 'accepted') {
      deliveries.forEach((delivery) => {
        btns.picked(delivery).action();
      })
    } else if (selectedTab.field === 'picked') {
      deliveries.forEach((delivery) => {
        btns.deliveried(delivery).action();
      })
    }
  }

  const checkShowAllButton = (status, configDeliveries) => {
    if (configDeliveries.length === 0) return false;
    const deliveryType = configDeliveries[0].type;
    if (status === 'waiting') return true;
    if (status === 'accepted') {
      if (deliveryType === 'inner_sender') return false;
      return true;
    }
    if (status === 'picked') {
      if (deliveryType === 'inner_receiver') return false;
      return true;
    }
    return false;
  }

  const btns = {
    accept: (delivery) => {
      const { order } = delivery;
      return {
        id: 'accept',
        text: 'Nhận đơn',
        action: () => {
          socket.emit('acceptDelivery', {
            driver_id: user.id,
            vehicle_id: user.vehicle_id,
            delivery_id: delivery._id
          })
          if (order.status === 'waiting') {
            socket.emit('updateOrderStatus', {
              order_id: order._id,
              status: 'accepted',
              date: new Date()
            })
          }
          // dispatch(acceptDelivery({ driver_id: user.id, delivery_id: id }))
        }
      }
    },
    viewOrder: (delivery) => {
      const { order } = delivery;
      const { items } = order;
      const orderPopop = {
        id: order._id,
        sender_address: order.sender_address,
        sender_name: order.sender_name,
        sender_phone: order.sender_phone,
        receiver_address: order.receiver_address,
        receiver_name: order.receiver_name,
        receiver_phone: order.receiver_phone,
        // quantity: items.length,
        weight: order.weight,
        items: items
      }
      return {
        id: 'viewOrder',
        text: 'Xem đơn hàng',
        action: () => {
          // setToggleViewOrderPopup(true)
          setOrderInfo(orderPopop)
        }
      }
    },
    picked: (delivery) => {
      const { order } = delivery;
      return {
        id: 'picked',
        text: 'Đã lấy hàng',
        action: () => {
          socket.emit('updateDeliveryStatus', {
            delivery_id: delivery._id,
            status: 'picked'
          })
          if (order.status === 'accepted') {
            socket.emit('updateOrderStatus', {
              order_id: order._id,
              status: 'picked',
              date: new Date()
            })
          }
          if (order.status === 'arrived_send_stock') {
            socket.emit('updateOrderStatus', {
              order_id: order._id,
              status: 'coming_dest_stock',
              date: new Date()
            })
          }
          if (order.status === 'arrived_dest_stock') {
            socket.emit('updateOrderStatus', {
              order_id: order._id,
              status: 'delivering',
              date: new Date()
            })
          }
          // dispatch(updateDeliveryStatus({ delivery_id: id, status: 'picked' }))
        }
      }
    },
    deliveried: (delivery) => {
      const { order } = delivery;
      return {
        id: 'deliveried',
        text: 'Đã giao xong',
        action: () => {
          socket.emit('updateDeliveryStatus', {
            delivery_id: delivery._id,
            status: 'deliveried'
          })
          if (order.status === 'picked') {
            socket.emit('updateOrderStatus', {
              order_id: order._id,
              status: 'arrived_send_stock',
              date: new Date()
            })
          }
          if (order.status === 'coming_dest_stock') {
            socket.emit('updateOrderStatus', {
              order_id: order._id,
              status: 'arrived_dest_stock',
              date: new Date()
            })
          }
          if (order.status === 'delivering') {
            socket.emit('updateOrderStatus', {
              order_id: order._id,
              status: 'success',
              date: new Date()
            })
          }
          // dispatch(updateDeliveryStatus({ delivery_id: id, status: 'deliveried' }))
        }
      }
    },
    cancel: (delivery) => {
      const { order } = delivery;
      return {
        id: 'cancel',
        text: 'Hủy',
        action() {
          socket.emit('deleteDelivery', {
            delivery_id: delivery._id
          })
          socket.emit('updateOrderStatus', {
            order_id: order._id,
            status: 'cancel',
            date: new Date()
          })
        }
      }
    }
  }

  useEffect(() => {
		dispatch(getAllDelivery(
      { 
        vehicle_id: user.vehicle_id,  
        area_code: user.area_code,
        district_code: user.district_code,
        type: user.typeUser === 'driver_inter' ? 'inter' : 'inner'
      }
    ))
	}, [dispatch, user.vehicle_id, user.area_code, user.district_code, user.typeUser])

	useEffect(() => {
		setAllDeliveries(deliveries)
	}, [deliveries])

  useEffect(() => {
    // socket.on('allDeliveries', (data) => {
    //   console.log('allDeliveries', data)
    //   setAllDeliveries(data);
    // })
    socket.on('newDeliveries', (data) => {
      if (allDeliveries.length === 0) {
        setAllDeliveries(data.filter((delivery) => delivery.type.includes(user.typeUser === 'driver_inter' ? 'inter' : 'inner') && delivery.area_code === user.area_code && user.district_code.includes(delivery.district_code)));
      } else {
        let deliveryType = allDeliveries[0].type;
        let tempDeliveries = data.filter((delivery) => delivery.type === deliveryType && delivery.area_code === user.area_code && delivery.district_code.includes(delivery.district_code));
        setAllDeliveries([...allDeliveries, ...tempDeliveries]);
      }
    })
    socket.on('updatedDelivery', (data) => {
      setAllDeliveries((prevDeliveries) => {
        const tempDeliveries = JSON.parse(JSON.stringify(prevDeliveries));
        tempDeliveries.forEach((item) => {
          if (item._id === data._id) {
            item.status = data.status
          }
        })
        return tempDeliveries
      })
    })
    socket.on('updateOrderStatus', (data) => {
      setAllDeliveries((prevDeliveries) => {
        const tempDeliveries = JSON.parse(JSON.stringify(prevDeliveries));
        tempDeliveries.forEach((item) => {
          if (item.order._id === data.order_id) {
            item.order.status = data.status
          }
        })
        return tempDeliveries
      })
    })
    socket.on('deleteDelivery', (delivery_id) => {
      setAllDeliveries(allDeliveries.filter((item) => item._id !== delivery_id))
    })
    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
  }, [socket, allDeliveries])

  useEffect(() => {
    if (selectedTab.field === 'waiting') {
      setDeliveriesByStatus(allDeliveries.filter((item) => item.status === 'waiting'))
    }
    if (selectedTab.field === 'accepted') {
      setDeliveriesByStatus(allDeliveries.filter((item) => item.status === 'accepted'))
    }
    if (selectedTab.field === 'picked') {
      setDeliveriesByStatus(allDeliveries.filter((item) => item.status === 'picked'))
    }
    if (selectedTab.field === 'deliveried') {
      setDeliveriesByStatus(allDeliveries.filter((item) => item.status === 'deliveried' || item.status === 'picked'))
    }
  }, [selectedTab, allDeliveries])

  useEffect(() => {
    const { accept, viewOrder, picked, deliveried, cancel } = btns;
    let tempDeliveries = JSON.parse(JSON.stringify(deliveriesByStatus));
    // let deliveryType = tempDeliveries[0].type;
    if (selectedTab.field === 'waiting') {
      tempDeliveries.forEach((item) => { item.btns = [accept(item), viewOrder(item)] })
    }
    if (selectedTab.field === 'accepted') {
      tempDeliveries.forEach((item) => { item.btns = [picked(item), viewOrder(item)] })
    }
    if (selectedTab.field === 'picked') {
      tempDeliveries.forEach((item) => { item.btns = [deliveried(item), viewOrder(item)] })
    }
    if (selectedTab.field === 'deliveried') {
      tempDeliveries.forEach((item) => { item.btns = [viewOrder(item)] })
    }
    setConfigDeliveries(tempDeliveries)
  }, [deliveriesByStatus])

  return (
    <div className='driver-home'>
      <div className='checkinBtn' onClick={() => setToggleCheckinPopup(true)}>
        <MdOutlineDonutSmall />
      </div>
      
      <h2 className='pb-3 fs-5'>Đơn hàng thực hiện</h2>
      <Tabs tabs={tabs} changeTab={setSelectedTab} selectedTab={selectedTab} />

      {
        checkShowAllButton(selectedTab.field, configDeliveries) &&
          <div className='actionAll' onClick={() => setToggleAllPopup(true)}>
            <span className='checkIcon'><FaCheck/></span>
            <span className='allText'>
              {
                selectedTab.field === 'waiting'
                ? 'Nhận tất cả đơn hàng'
                : selectedTab.field === 'accepted'
                  ? 'Đã lấy tất cả đơn hàng'
                  : 'Đã giao xong tất cả đơn hàng'
              }
            </span>
          </div>
      }


      <div className='deliveryList'>  
        {configDeliveries.map((delivery) => (
          <DeliveryOrder
            key={delivery._id}
            delivery={delivery}
            toggleViewOrderPopup={toggleViewOrderPopup}
            closePopup={() => setToggleViewOrderPopup(false)}
          />
        ))}
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

      {toggleAllPopup && (
        <ConfirmPopup 
          title="Bạn xác nhận thực hiện trên tất cả các đơn hàng này?"
          actionNo={() => setToggleAllPopup(false)}
          actionYes={() => { handleAllAction(configDeliveries); setToggleAllPopup(false); }}
          cancelLabel="Đóng lại"
          okLabel="Xác nhận"
      />
      )}

    </div>
  )
}

export default DriverHome