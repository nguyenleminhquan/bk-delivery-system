import {useState, useEffect} from 'react';
import {MdOutlineDonutSmall} from 'react-icons/md'
import styles from './Driver.module.scss'
import ConfirmPopup from 'components/ConfirmPopup';
import checkinImg from '../../../../assests/images/checkin.png'

const shiftModel = {
  label: '',
  time: '',
} 

function DriverHome() {
  const [togglePopup, setTogglePoup] = useState(false);
  const [timeShift, setTimeShift] = useState('');
  const [today, setToday] = useState('');
  const [shift, setShift] = useState(shiftModel);

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

    if (currentHour < 12) {
      setShift({label: 'Sáng', time: '7h-11h'});
    } else {
      setShift({label: 'Chiều', time: '13h-18h'});
    }
  }

  const getTimeSheet = () => {
    const currentTime =  new Date().toLocaleTimeString('en-US', { hour12: false, 
      hour: "numeric", 
      minute: "numeric"});
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
    getTimeSheet();
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
    </div>
  )
}

export default DriverHome