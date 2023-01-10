import React from 'react'
import './index.scss'

function FormSelect({ name, value, handleChange, labelText, list, icon }) {
	return (
		<div className='form-iselect'>
			{
				labelText &&
				<label htmlFor={name}>
					{labelText}
				</label>
			}
			<div className='select-box'>
				{icon}
				<select
					name={name}
					id={name}
					value={value}
					onChange={handleChange}
					className='select-field'
				>
					<option value="" disabled defaultChecked>Chọn một tùy chọn</option>
					{list.map((itemValue, index) => {
						return (
							<option key={index} value={itemValue}>
								{itemValue}
							</option>
						);
					})}
				</select>
			</div>
		</div>
	)
}

export default FormSelect