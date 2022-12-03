import React, { useEffect, useRef, useState } from 'react'
import styles from './Sidebar.module.scss'
import image from '../../assests/images/Logo.png'
import { BsThreeDots } from 'react-icons/bs'
import { BiHistory, BiUserCircle } from 'react-icons/bi'
import { AiOutlineBell, AiOutlineHome, AiFillIdcard } from 'react-icons/ai'
import { IoIosArrowBack } from 'react-icons/io'
import SidebarAction from './SidebarAction'

function Sidebar() {
    const [hideSidebar, setHideSidebar] = useState(false)
    const sidebarRef = useRef()

    const toggleSidebar = () => {
        setHideSidebar(!hideSidebar)
    }

    // useEffect(() => {
    //     if (hideSidebar) {
    //         sidebarRef.current.classList.add(styles['minimizeSidebar'])
    //     } else {
    //         sidebarRef.current.classList.remove(styles['minimizeSidebar'])
    //     }
    // })

    return (
        <div className={styles.wrapper} ref={sidebarRef}>
            <div className={styles.logoWrap}>
                <img src={image} alt="" className='w-75 mx-auto'/>
            </div>
            <div className='d-flex align-items-center justify-content-between mb-5 px-4'>
                <div className='d-flex'>
                    <div className={`my-auto ${styles.userAvatar}`}>
                        <div className='bg-primary w-100 h-100'></div>
                    </div>
                    <div className='ms-3'>
                        <p className={styles.userName}>phuoctai1644</p>
                        <p className={styles.userId}>ID: <span>123456</span></p>
                    </div>
                </div>

                <div className={styles.userAction}>
                    <BsThreeDots />
                </div>
            </div>

            <div className={styles.sibarGroup}>
                <SidebarAction icon={<BiHistory />} name="Yêu cầu xử lí"/>
                <SidebarAction icon={<AiOutlineBell />} name="Thông báo" />
                <hr />
                <SidebarAction icon={<AiOutlineHome />} name="Trang chủ"/> 
                <SidebarAction icon={<AiFillIdcard />} name="Đối soát COD" /> 
                <SidebarAction icon={<BiUserCircle />} name="Thông tin cá nhân" active/> 
            </div>

            <div className={styles.hideSidebar} onClick={toggleSidebar}>
                <IoIosArrowBack />
            </div>
        </div>
  )
}

export default Sidebar