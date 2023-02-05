import Logo from 'components/Logo'
import { Link } from 'react-router-dom'
import React from 'react'
import './index.scss'

function OuterTemplate({ children }) {
  return (
    <div className='outer-template'>
        <div className='left'>
            <Link to='/'><Logo /></Link>
            <img className='truck' src={require('assests/images/truck-illustration.png')} />
        </div>
        <div className='right'>
            { children }
        </div>
    </div>
  )
}

export default OuterTemplate