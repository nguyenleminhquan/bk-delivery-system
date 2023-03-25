import React, { useState } from 'react'
import ReactDatePicker from 'react-datepicker'

import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';
import './index.scss'

function DatePickerComp({ handleSearch }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [option, setOption] = useState('byDate')

  const handleChange = (e) => {
    setOption(e.target.value);
    setStartDate(null)
    setEndDate(null)
  }

  const handleSubmit = () => {
    if (startDate && endDate) {
      handleSearch(startDate, endDate) 
      return
    }
    toast.warning('Chưa chọn thời gian')
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
              placeholderText='Chọn một ngày'
              selected={startDate}
              onChange={(date) => {
                setStartDate(date)
                setEndDate(date)
              }
            }
            />
          : (option === 'byMonth'
          ? <ReactDatePicker 
              placeholderText='Chọn một tháng'
              selected={startDate}
              onChange={(date) => {
                setStartDate(date.setDate(1))
                setEndDate(date.setMonth(date.getMonth() + 1).setDate(date.getDate() - 1))
              }}
              dateFormat="MM/Y"
              showMonthYearPicker
            />
            : <div className='date-range'>
                <div>
                  <span>Từ</span>
                  <ReactDatePicker
                    placeholderText='Chọn ngày bắt đầu'
                    dateFormat="dd/MM/Y"
                    selected={startDate}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    onChange={date => setStartDate(date)}
                  />
                </div>
                <div>
                  <span>Đến</span>
                  <ReactDatePicker
                    placeholderText='Chọn ngày kết thúc'
                    dateFormat="dd/MM/Y"
                    selected={endDate}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    onChange={date => setEndDate(date)}
                  />
                </div>
            </div>
          )    
        }
      </div>
      <button className='btn btn-medium' onClick={handleSubmit}>Tìm kiếm</button>
         
    </div>
  )
}

export default DatePickerComp