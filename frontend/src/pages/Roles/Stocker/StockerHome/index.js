import React from 'react';
import styles from './Stocker.module.scss'
import { Link } from 'react-router-dom';
import { BiPencil } from 'react-icons/bi';
import { TbFileExport } from 'react-icons/tb'

function StockerHome() {
  return (
    <div className={styles.wrapper}>
      <header className='d-flex justify-content-between align-items-center'>
        <h2 className='fs-1'>Tổng quan</h2>
        <div className={styles.action}>
            <Link className='btn fs-4' to="/">
                <TbFileExport className='me-3'/> Xuất Excel
            </Link>

            <Link className='btn ms-4 fs-4' to="/export-order">
                <BiPencil className='me-3'/> Xuất Kho
            </Link>

            <Link className='btn ms-4 fs-4' to="/create-order">
                <BiPencil className='me-3'/> Nhập Kho
            </Link>
        </div>
      </header>
    </div>
  )
}

export default StockerHome