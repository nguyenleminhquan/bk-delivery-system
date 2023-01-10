import Sidebar from 'components/Sidebar'
import React from 'react'
import { Outlet } from 'react-router-dom'

function SharedLayout() {
  return (
    <div className='wrapper'>
      <Sidebar />
      <Outlet />
    </div>
  )
}

export default SharedLayout