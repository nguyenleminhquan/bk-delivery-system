import Sidebar from 'components/Sidebar'
import React from 'react'
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom'
import { adminSidebar, driverSidebar, senderSidebar, stockerSidebar } from 'utils/constants';

function SharedLayout() {
  const { user } = useSelector((state) => state.user);
  let sidebarItems;
  if (user.typeUser === 'sender') {
    sidebarItems = senderSidebar;
  }
  if (user.typeUser === 'driver') {
    sidebarItems = driverSidebar;
  }
  if (user.typeUser === 'stocker') {
    sidebarItems = stockerSidebar;
  }
  if (user.typeUser === 'admin') {
    sidebarItems = adminSidebar;
  }

  return (
    <div className='wrapper'>
      <Sidebar sidebarItems={sidebarItems} />
      {/* <Outlet /> */}
    </div>
  )
}

export default SharedLayout