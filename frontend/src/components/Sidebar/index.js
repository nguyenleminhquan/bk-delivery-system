import { Link } from 'react-router-dom'
import { useState } from 'react'
import styles from './Sidebar.module.scss'

// Import for images
import logo from '../../assests/images/Logo.png'
import avatar from '../../assests/images/demo-avatar.png'

// Import for icons
import { BsThreeDots } from 'react-icons/bs'
import { useSelector, useDispatch } from 'react-redux'
import { clearStore } from 'features/user/userSlice'

function Sidebar({ sidebarItems }) {
	const { user } = useSelector(state => state.user)
	const [activeTab, setActiveTab] = useState(sidebarItems.find((item) => item.path === '/').id)
	const dispatch = useDispatch();

	// useEffect(() => {
	//     const pathName = window.location.pathname;
	//     if (pathName === '/profile') {
	//         setActiveTab(3);
	//     }
	// })

	return (
		<div className={styles.sidebar}>
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
					<BsThreeDots className='fs-2' role='button' />
				</div>

				<div className={styles.userMenu}>
					<ul className={styles.menuLists}>
						{
							sidebarItems.filter(item => item.type === 'above').map((item) => (
								<li className={styles.listItem} key={item.id} onClick={() => item.path === '/logout' && dispatch(clearStore('Logging out...'))}>
									<Link
										to={item.path}
										className={`${styles.menuLink} ${activeTab === item.id && styles.active}`}
										onClick={() => setActiveTab(item.id)}
									>
										<div className="d-flex align-items-center me-3">
											{item.icon}
										</div>
										{item.text}
									</Link>
								</li>
							))
						}
					</ul>
				</div>

				<hr />

				<div className={styles.systemMenu}>
					<ul className={styles.menuLists}>
						{
							sidebarItems.filter(item => item.type === 'beneath').map((item) => (
								<li className={styles.listItem} key={item.id}>
									<Link
										to={item.path}
										className={`${styles.menuLink} ${activeTab === item.id && styles.active}`}
										onClick={() => setActiveTab(item.id)}
									>
										<div className="d-flex align-items-center me-3">
											{item.icon}
										</div>
										{item.text}
									</Link>
								</li>
							))
						}
					</ul>
				</div>
			</div>
		</div>
	)
}

export default Sidebar