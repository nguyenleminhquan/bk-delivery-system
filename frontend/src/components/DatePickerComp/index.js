import React, { useState } from 'react'
import ReactDatePicker from 'react-datepicker'

import "react-datepicker/dist/react-datepicker.css";
// import DatePicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
import './index.scss'

function DatePickerComp() {
  const [startDate, setStartDate] = useState(new Date());
  const [option, setOption] = useState('byDate')

  const handleChange = (e) => {
    setOption(e.target.value);
  }

  return (
    <div className='date-picker'>
      <div className='options'>
        <select onChange={handleChange}>
          <option name="dateOption" value="byDate">Theo ngày</option>
          <option name="dateOption" value="byMonth">Theo tháng</option>
          <option name="dateOption" value="byPeriod">Theo khoảng thời gian</option>
        </select>
      </div>
      <div className='date-input'>
        {
          option === 'byDate' 
          ? <ReactDatePicker 
              selected={startDate}
              onChange={(date) => setStartDate(date)}
            />
          : (option === 'byMonth'
          ? <ReactDatePicker 
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="MM/Y"
              showMonthYearPicker
            />
            : <ReactDatePicker 
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                show
              />)
        }
      </div>
         
    </div>
  )
}

export default DatePickerComp