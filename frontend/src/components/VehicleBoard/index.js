import React from 'react'
import './index.scss'

function VehicleBoard({ vehicleInfo }) {
    const { current_weight, max_weight, license_plate_number } = vehicleInfo;
    return (
        <div className='vehicle-board'>
            {/* <img className='white-pattern' src={require('assests/images/white-pattern.jpg')}/> */}
            <div className='vehicle-board-wrapper'>
                <div className='vehicle-info'>
                    <p className='title'>Xe tải nội thành</p>
                    <div className='vehicle-desc'>
                        <p>
                            <span>Trọng tải</span> 
                            <span className='value'>{ max_weight } kg</span> 
                        </p>
                        <p>
                            <span>Tải trọng</span> 
                            <span className='value'>{ current_weight } kg</span> 
                        </p>
                        <p>
                            <span>Số lượng đơn hàng</span>
                            <span className='value'>15 đơn hàng</span>
                        </p>
                        <p>
                            <span>Biển số xe</span> 
                            <span className='value'>{ license_plate_number }</span> 
                        </p>
                    </div>
                </div>
                <img className='logo' src={require('assests/images/truck-driver.png')} />
            </div>
        </div>
    )
}

export default VehicleBoard