import React, { useState } from 'react'
import { BiExport, BiPencil } from 'react-icons/bi'
import { Link } from 'react-router-dom'
import './index.scss'
import * as XLSX from 'xlsx'
import GeneralConfirm from 'components/GeneralConfirm'
import DatePicker from 'components/DatePickerComp'

const data = [
  {
    id: '1234561231',
    customer: 'Phuoc Tai',
    category: 'Điện tử',
    createdTime: '18/11/2022 23:22',
    totalPrice: '312.000 đ',
  },
  {
    id: '1234561231',
    customer: 'Phuoc Tai',
    category: 'Điện tử',
    createdTime: '18/11/2022 23:22',
    totalPrice: '312.000 đ',
  },
  {
    id: '1234561231',
    customer: 'Phuoc Tai',
    category: 'Điện tử',
    createdTime: '18/11/2022 23:22',
    totalPrice: '312.000 đ',
  },
]

function StockerHeader({ title, openImportPopup }) {
  const [toggleExportExcel, setToggleExportExcel] = useState(false);

  const handleExport = () => {
    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'MyExcel.xlsx');
  } 

  return (
    <div className='stocker-header d-flex justify-content-between'>
        <h2 className='pb-3 fs-3'> { title } </h2>
        <div className='btns'>
            <button className='btn fs-6' onClick={() => setToggleExportExcel(true)}>
              <BiExport className='me-3' /> Xuất excel
            </button>
            <Link className='btn fs-6' to="/export-order">
              <BiPencil className='me-3' /> Xuất kho
            </Link>
            <button className='btn fs-6' onClick={openImportPopup}>
              <BiPencil className='me-3' /> Nhập kho
            </button>
        </div>
        {
          toggleExportExcel &&
          <GeneralConfirm
            title="Xuất báo cáo ra file excel" 
            onCancel={() => setToggleExportExcel(false)}
            cancelText="Hủy bỏ"
            showConfirmButton={true}
            confirmText="Xuất file"
            onConfirm={() => {
              handleExport();
              setToggleExportExcel(false)
            }}
            message={<DatePicker />}
          />
        }
    </div>
  )
}

export default StockerHeader