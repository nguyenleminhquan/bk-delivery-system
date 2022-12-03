import React from 'react'
import Sidebar from 'components/Sidebar'
import styles from './Home.module.scss'

function Home() {
  return (
    <div className={styles.wrapper}>
        
        <Sidebar />
    </div>
  )
}

export default Home