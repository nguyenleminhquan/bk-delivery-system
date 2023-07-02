import AddressTab from 'components/AddressTab';
import BankAccountTab from 'components/BankAccountTab';
import ChangePassTab from 'components/ChangePassTab';
import PersonalTab from 'components/PersonalTab';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { profileTabs } from 'utils/constants';
import { useLocation } from 'react-router-dom';
import './index.scss'

function Profile() {
	const { user } = useSelector((state) => state.user);
	const location = useLocation();
	const [tab, setTab] = useState('personal');

	useState(() => {
		const queryParams = new URLSearchParams(location.search);
		const activeTab = queryParams.get('tab');
		if (activeTab) {
			setTab(activeTab);
		}
	}, [])

	return (
		<div className='profile'>
			<div className='profile-container'>
				<div className='card'>
					<span className='avatar'></span>
					<span> {user.fullname} </span>
				</div>
				<ul className='tabs'>
					{
						profileTabs.map((item) =>
							<li key={item.id} onClick={() => setTab(item.name)} className={tab === item.name ? 'tab active' : 'tab'} >
								{item.value}
							</li>
						)
					}
				</ul>
				<div className='tab-item'>
				{
					tab === 'personal'
						? <PersonalTab />
						: (tab === 'address'
							? <AddressTab />
							: (tab === 'bank-account'
								? <BankAccountTab />
								: <ChangePassTab />))
				}
				</div>
				{/* <img className='illus-img' src={require('assests/images/hill-illustration.png')} /> */}
			</div>
		</div>
	)
}

export default Profile