// Libraries import
import React from 'react'
import { Link } from 'react-router-dom'
import * as XLSX from 'xlsx'

// Icons import
import { BiExport, BiImport } from 'react-icons/bi'
import { FaFileExport } from 'react-icons/fa'

// Css import
import './index.scss';

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

  const handleExport = () => {
    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'MyExcel.xlsx');
  } 

  return (
    <div className='stocker-header'>
      <div className="d-none d-sm-flex justify-content-between mb-3">
        <h2 className='pb-3 fs-3'> { title } </h2>
        <div className='btns'>
          <button className='btn fs-6' onClick={handleExport}>
            <FaFileExport className='me-3' /> Xuất excel
          </button>
          <Link className='btn fs-6' to="/export-order">
            <BiExport className='me-3' /> Xuất kho
          </Link>
          <button className='btn fs-6' onClick={openImportPopup}>
            <BiImport className='me-3' /> Nhập kho
          </button>
        </div>
      </div>

      <div className="d-flex d-sm-none mobile-actions">
        <button className='action-btn primary' onClick={handleExport}>
          <FaFileExport />
        </button>
        <Link className='action-btn primary ms-2' to="/export-order">
          <BiExport />
        </Link>
        <button className='action-btn primary ms-2' onClick={openImportPopup}>
          <BiImport />
        </button>
      </div>
    </div>
  )
}

export default StockerHeader
