import React from 'react'
import { BiExport, BiPencil } from 'react-icons/bi'
import { Link } from 'react-router-dom'
import './index.scss'

function StockerHeader({ title, openImportPopup }) {
  return (
    <div className='stocker-header d-flex justify-content-between'>
        <h2 className='pb-3 fs-3'> { title } </h2>
        <div className='btns'>
            <button className='btn fs-6'>
              <BiExport className='me-3' /> Xuất excel
            </button>
            <Link className='btn fs-6' to="/export-order">
              <BiPencil className='me-3' /> Xuất kho
            </Link>
            <button className='btn fs-6' onClick={openImportPopup}>
              <BiPencil className='me-3' /> Nhập kho
            </button>
        </div>
    </div>
  )
}

export default StockerHeader