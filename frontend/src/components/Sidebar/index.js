import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import styles from './Sidebar.module.scss'

// Import for images
import logo from '../../assests/images/Logo.png'
import avatar from '../../assests/images/demo-avatar.png'

// Import for icons
import {BsThreeDots, BsPersonCircle} from 'react-icons/bs'
import {AiOutlineHistory, AiOutlineHome} from 'react-icons/ai'
import {BiLogOut} from 'react-icons/bi'
import {IoMdNotificationsOutline, IoNotificationsSharp} from 'react-icons/io'
import {FaAddressCard, FaHome} from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { testJWT, clearStore } from 'features/user/userSlice'

function Sidebar() {
    const {user} = useSelector(state => state.user)
    const [activeTab, setActiveTab] = useState(1)
    const dispatch = useDispatch();

    useEffect(() => {
        const pathName = window.location.pathname;
        if (pathName === '/profile') {
            setActiveTab(3);
        }
    })

    useEffect(() => {
		dispatch(testJWT())
	}, [])

  return (
    <div className={styles.wrapper}>
        <div className={styles.logo}>
            <img src={logo} alt="BK Delivery" />            
        </div>

        <div className={styles.menu}>
            <div className={styles.userInfo}>
                <img src={avatar} alt="User Avatar" />
                <div>
                    {/* {username} */}
                    <h3>{user.fullname}</h3>
                    {/* {email} */}
                    <p>{user.email}</p>
                </div>
                <BsThreeDots className='fs-2' role='button'/>
            </div>

            <div className={styles.userMenu}>
                <ul className={styles.menuLists}>
                    <li className={styles.listItem}>
                        <a href="" className={styles.menuLink}>
                            <div className='me-3'>
                                <AiOutlineHistory />
                            </div>
                            Yêu cầu xử lí</a>
                    </li>
                    <li className={styles.listItem}>
                        <a href="" className={styles.menuLink}>
                            <div className="me-3">
                                <IoMdNotificationsOutline />
                            </div>
                            Thông báo</a>
                        <div className={styles.notiCount}>
                            <span>2</span>
                        </div>
                    </li>
                    <li className={styles.listItem} onClick={() => dispatch(clearStore('Logging out...'))}>
                        <a href="" className={styles.menuLink}>
                            <div className='me-3'>
                                <BiLogOut />
                            </div>
                            Đăng xuất</a>
                    </li>
                </ul>
            </div>

            <hr />

            <div className={styles.systemMenu}>
                <ul className={styles.menuLists}>
                    <li className={styles.listItem}>
                        <Link 
                            to='/' 
                            className={`${styles.menuLink} ${activeTab === 1 && styles.active}`} 
                            onClick={() => setActiveTab(1)}>
                            <div className="d-flex align-items-center me-3">
                                <FaHome />
                            </div>
                            Trang chủ
                        </Link>
                    </li>
                    <li className={styles.listItem}>
                        <Link 
                            to='/cod' 
                            className={`${styles.menuLink} ${activeTab === 2 && styles.active}`}  
                            onClick={() => setActiveTab(2)}>
                            <div className="d-flex align-items-center me-3">
                                <FaAddressCard />
                            </div>
                            Đối soát COD
                        </Link>
                    </li>
                    <li className={styles.listItem}>
                        <Link 
                            to='/profile' 
                            className={`${styles.menuLink} ${activeTab === 3 && styles.active}`}
                            onClick={() => setActiveTab(3)}>
                            <div className="d-flex align-items-center me-3">
                                <BsPersonCircle />
                            </div>
                            Thông tin cá nhân
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    </div>
  )
}

export default Sidebar