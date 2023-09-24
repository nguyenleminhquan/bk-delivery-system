import React from 'react'
import './index.scss'
import { FaStar } from 'react-icons/fa'

function Tabs({ tabs, changeTab, selectedTab }) {
  return (
    <div className='tab-comp'>
        <ul className='pt-1 pt-sm-0'>
            {
                tabs.map((tab) => 
                    <li key={tab.name}
                        className={selectedTab.field === tab.field ? 'tab active' : 'tab'}
                        onClick={() => changeTab(tab)}
                    >
                        <FaStar className='icon' />
                        {tab.name}
                    </li>
                )
            }
        </ul>
    </div>
  )
}

export default Tabs