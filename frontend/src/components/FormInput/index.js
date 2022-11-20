import React from 'react'
import './index.scss'

function FormInput({ name, type, value, handleChange, labelText, placeholderText, icon }) {
  return (
    <div className='form-input'>
        {
        labelText &&
        <label htmlFor={name}>
            {labelText}
        </label>
        }
        <div className='input-box'>
            {/* <span className='icon'>{icon}</span> */}
            {icon}
            <input
                type={type}
                name={name}
                value={value}
                placeholder={placeholderText}
                onChange={handleChange} 
                className='input-field'
            />
        </div>
    </div>
  )
}

export default FormInput