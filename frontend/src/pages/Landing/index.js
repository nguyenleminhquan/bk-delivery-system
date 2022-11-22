import React from 'react'
import Logo from 'components/Logo';
import { BsCheck2 } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import './index.scss'

function Landing() {
	return (
		<div className='landing'>
			<div className='landing-container'>
				<nav>
					<Logo />
					
				</nav>
				<div className='hero'>
					<div className='hero-content'>
						<h2>Hệ thống vận chuyển hàng hóa liên tỉnh</h2>
						<ul>
							<li>
								<BsCheck2 />
								Nhanh chóng, an toàn, tiện lợi
							</li>
							<li>
								<BsCheck2 />
								Phủ sóng 63 tỉnh thành
							</li>
							<li>
								<BsCheck2 />
								Đối soát trả tiền nhanh
							</li>
						</ul>
						<Link to='/login' className='btn'>Đăng nhập/Đăng ký</Link>
					</div>
					<div className='hero-img'>
						<img src={require('assests/images/landing-img.png')} />
					</div>
				</div>
			</div>
		</div>
	)
}

export default Landing