import {useState, useEffect} from 'react';
import {MdOutlineDonutSmall} from 'react-icons/md'
import styles from './Driver.module.scss'
import ConfirmPopup from 'components/ConfirmPopup';
import checkinImg from '../../../../assests/images/checkin.png'

const shiftModel = {
  label: '',
  time: '',
} 

const tabs = [
  {
    name: 'Đơn được gán',
    data: []
  },
  {
    name: 'Đang làm',
    data: [],
  },
  {
    name: 'Đã xong',
    data: [],
  }
]

function DriverHome() {
  const [togglePopup, setTogglePoup] = useState(false);

  // Work check-in only
  const [today, setToday] = useState('');
  const [shift, setShift] = useState(shiftModel);
  
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  const formatToday = () => {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    setToday(`${day}/${month}/${year}`);
  }

  const getShift = () => {
    const now = new Date();
    const currentHour = now.getHours();

    console.log(currentHour)

    if (currentHour < 12) {
      console.log(true)
      setShift({label: 'Sáng', time: '7h-11h'});
    } else {
      console.log(false)
      setShift({label: 'Chiều', time: '13h-18h'});
    }
  }

  const handleTracking = () => {
    console.log('Chúc mừng bạn đã điểm danh thành công');
    // Cakk api for work-tracking...

  }

  const WorkCheckIn = () => {
    return (
      <div className={styles.workCheckInModel}>
        <div className='d-flex justify-content-between'>
          <span>Ngày: {today}</span>
          <div className="d-flex flex-column align-items-end text-right">
            <span>Ca làm việc: {shift.label}</span>
            <span>Thời gian làm việc: {shift.time}</span>
          </div>
        </div>
        <div className={styles.illustration}>
          <img src={checkinImg} alt="" />
        </div>
      </div>
    )
  }

  useEffect(() => {
    formatToday();
    getShift();
  }, [])

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
      <h2 className='pb-3 fs-1'>Đơn hàng thực hiện</h2>
      
      <ul className={styles.tabHeader}>
        {tabs.map(tab => (
          <li key={tab.name} 
            className={selectedTab.name === tab.name ? `${styles.tabHeaderItem} ${styles.active}` : `${styles.tabHeaderItem}`}
            onClick={() => setSelectedTab(tab)}
          >{tab.name}</li>
        ))}
      </ul>

    </div>
  )
}

export default DriverHome