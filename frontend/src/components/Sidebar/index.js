import { Link } from 'react-router-dom';
import { useState } from 'react';
import Modal from 'react-modal';

// Import for images
import logo from '../../assests/images/Logo.png'
import avatar from '../../assests/images/demo-avatar.png'

// Import for icons
import { BsThreeDots } from 'react-icons/bs'
import { useSelector, useDispatch } from 'react-redux'
import { clearStore } from 'features/user/userSlice'

import './index.scss';
import { AiOutlineMenu } from 'react-icons/ai'

const customStyles = {
  content: {
		top: 0,
		left: 0,
		bottom: 0,
		width: '80%',
  },
	overlay: {
		backgroundColor: 'rgba(0, 0, 0, 0.2)',
		zIndex: '10',
	}
};

function Sidebar({ sidebarItems }) {
	const dispatch = useDispatch();
	const { user } = useSelector(state => state.user);
	const [activeTab, setActiveTab] = useState(sidebarItems.find((item) => item.path === '/'));
	const [showSidebar, setShowSidebar] = useState(false);

	const onMenuClicked = item => {
		if (showSidebar) {
			setShowSidebar(false);
		}
		if (item.path === '/logout') {
			dispatch(clearStore('Logging out...'));
			return;
		}
		setActiveTab(item);
	}

	return (
		<div className='sidebar-wrapper'>
			<div className="d-none d-sm-block">
				<div className='sidebar-web'>
					<div className='logo'>
						<img src={logo} alt="BK Delivery" />
					</div>

					<div className='menu'>
						<div className='user-info'>
							<div className="d-flex align-items-center">
								<img src={avatar} alt="User Avatar" className='icon-xlg rounded-circle me-2' />
								<div className='d-flex flex-column'>
									<span className='name'>{user.fullname}</span>
									<span className='email'>{user.email}</span>
								</div>
							</div>
							<BsThreeDots className='fs-5' role='button' />
						</div>

						<div className='user-menu'>
							<ul className='menu-lists'>
								{
									sidebarItems.filter(item => item.type === 'above').map((item) => (
										<li className='list-item' key={item.id} onClick={() => item.path === '/logout' && dispatch(clearStore('Logging out...'))}>
											<Link
												to={item.path}
												className={'menu-link' + (activeTab.id === item.id ? ' active' : '')}
												onClick={() => setActiveTab(item)}
											>
												<div className="d-flex align-items-center me-2 icon-md">
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

						<div className='system-menu'>
							<ul className='menu-lists'>
								{
									sidebarItems.filter(item => item.type === 'beneath').map((item) => (
										<li className='list-item' key={item.id}>
											<Link
												to={item.path}
												className={'menu-link' + (activeTab.id === item.id ? ' active' : '')}
												onClick={() => setActiveTab(item)}
											>
												<div className="d-flex align-items-center me-2 icon-md">
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
			</div>

			<div className="d-block d-sm-none">
				<div className='sidebar-mobile'>
					<div className="left d-flex-center">
						<div className='menu-btn' onClick={() => setShowSidebar(true)}>
							<AiOutlineMenu />
						</div>

						<div className="page ms-3">
							<span>{activeTab?.text}</span>
						</div>
					</div>

					<div className="right"></div>

					<Modal
						isOpen={showSidebar}
						style={customStyles}
						appElement={document.getElementById('root')}
						onRequestClose={() => setShowSidebar(false)}
					>
						<div className="sidebar-container">
							<div className="user">
								<img alt={user.fullname} src={avatar} className='user-avatar' />
								<span className="fw-semibold ms-2">{user.fullname}</span>
							</div>

							<div className="sidebar-lists">
								{sidebarItems.filter(item => item?.type === 'above').map(item => (
									<Link to={item.path}
										key={item.id}
										className={"sidebar-item " + `${activeTab.id === item.id ? 'active' : ''}`}
										onClick={() => onMenuClicked(item)}>
										<div className="sidebar-icon me-3">{item.icon}</div>
										<div className="sidebar-text">{item.text}</div>
									</Link>
								))}
							</div>

							<hr />

							<div className="sidebar-lists">
								{sidebarItems.filter(item => item?.type === 'beneath').map(item => (
									<Link to={item.path}
										key={item.id}
										className={"sidebar-item " + `${activeTab.id === item.id ? 'active' : ''}`}
										onClick={() => onMenuClicked(item)}>
										<div className="sidebar-icon me-3">{item.icon}</div>
										<div className="sidebar-text">{item.text}</div>
									</Link>
								))}
							</div>
						</div>
					</Modal>
				</div>
			</div>
		</div>
	)
}

export default Sidebar
