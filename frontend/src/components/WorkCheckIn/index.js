import React, { useEffect, useState } from 'react'
import styles from './WorkCheckIn.module.scss'
import checkinImg from 'assests/images/checkin.png'

const shiftModel = {
  label: '',
  time: '',
} 

function WorkCheckIn() {
	// Work check-in only
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

    console.log(currentHour)

    if (currentHour < 12) {
      console.log(true)
      setShift({label: 'Sáng', time: '7h-11h'});
    } else {
      console.log(false)
      setShift({label: 'Chiều', time: '13h-18h'});
    }
  }

	useEffect(() => {
    formatToday();
    getShift();
  }, [])

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

export default WorkCheckIn