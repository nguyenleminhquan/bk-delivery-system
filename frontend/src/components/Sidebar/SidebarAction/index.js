import React from 'react'
import styles from './SidebarAction.module.scss'

function SidebarAction({icon, name, msg = null, active = false}) {
  return (
    <div className={active ? styles.wrapperActive : styles.wrapper}>
        {icon}
        <span>{name}</span>
    </div>
  )
}

export default SidebarAction