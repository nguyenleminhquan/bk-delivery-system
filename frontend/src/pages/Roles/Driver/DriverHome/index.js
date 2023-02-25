import {useState, useEffect} from 'react';
import {MdOutlineDonutSmall} from 'react-icons/md'
import styles from './Driver.module.scss'
import ConfirmPopup from 'components/ConfirmPopup';
import WorkCheckIn from 'components/WorkCheckIn';
import DeliveryOrder from 'components/DeliveryOrder';

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
  const [deliveries, setDeliveries] = useState([]);
  
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
    const { accept, viewOrder, picked, deliveried } = btns;
    if (selectedTab.field === 'waiting') {
      setDeliveries([
        {
          from: 'Dien may xanh&Số 130 Trần Quang Khải, P. Tân Định, Quận 1, Tp. Hồ Chí Minh',
          to: 'Kho TP.HCM&Nguyen Thi Minh Khai, Q1, TP.HCM',
          btns: [accept(), viewOrder()]
        },
        {
          from: 'Dien may xanh&Số 130 Trần Quang Khải, P. Tân Định, Quận 1, Tp. Hồ Chí Minh',
          to: 'Kho TP.HCM&Nguyen Thi Minh Khai, Q1, TP.HCM',
          btns: [accept(), viewOrder()]
        },
        {
          from: 'Dien may xanh&Số 130 Trần Quang Khải, P. Tân Định, Quận 1, Tp. Hồ Chí Minh',
          to: 'Kho TP.HCM&Nguyen Thi Minh Khai, Q1, TP.HCM',
          btns: [accept(), viewOrder()]
        },
        {
          from: 'Dien may xanh&Số 130 Trần Quang Khải, P. Tân Định, Quận 1, Tp. Hồ Chí Minh',
          to: 'Kho TP.HCM&Nguyen Thi Minh Khai, Q1, TP.HCM',
          btns: [accept(), viewOrder()]
        },
        {
          from: 'Dien may xanh&Số 130 Trần Quang Khải, P. Tân Định, Quận 1, Tp. Hồ Chí Minh',
          to: 'Kho TP.HCM&Nguyen Thi Minh Khai, Q1, TP.HCM',
          btns: [accept(), viewOrder()]
        },
      ])
    }
    if (selectedTab.field === 'accepted') {
      setDeliveries([
        {
          from: 'Nguyen Minh Hien&Kí túc xá khu B, Đông Hòa, Dĩ An, Bình Dương',
          to: 'Kho TP.HCM&Nguyen Thi Minh Khai, Q1, TP.HCM',
          btns: [picked(), viewOrder()]
        }
      ])
    }
    if (selectedTab.field === 'picked') {
      setDeliveries([])
    }
  }, [selectedTab])

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
        {deliveries.map((delivery) => (
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