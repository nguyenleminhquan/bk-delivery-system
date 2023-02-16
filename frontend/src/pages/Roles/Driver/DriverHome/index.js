import {useState, useEffect} from 'react';
import {MdOutlineDonutSmall} from 'react-icons/md'
import styles from './Driver.module.scss'
import ConfirmPopup from 'components/ConfirmPopup';

function DriverHome() {
  const [togglePopup, setTogglePoup] = useState(false);
  const [timeShift, setTimeShift] = useState(''); 

  const getTimeSheet = () => {
    const currentTime =  new Date().toLocaleTimeString('en-US', { hour12: false, 
      hour: "numeric", 
      minute: "numeric"});
  }

  const handleTracking = () => {
    console.log('Chúc mừng bạn đã điểm danh thành công');
  }

  const workCheckIn = () => (
    <div className='d-flex flex-column'>
      <div className='d-flex justify-content-between'>
        <span>Ngày: {new Date()}</span>
      </div>
    </div>
  )

  useEffect(() => {
    getTimeSheet();
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.checkinBtn} onClick={() => setTogglePoup(!togglePopup)}>
        <MdOutlineDonutSmall />
      </div>
      {togglePopup && (
        <ConfirmPopup 
          title="Check in hôm nay"
          content={workCheckIn}
          actionNo={() => setTogglePoup(false)}
          actionYes={() => handleTracking()}
      />
      )}
    </div>
  )
}

export default DriverHome