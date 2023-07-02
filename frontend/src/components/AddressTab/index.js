import FormSelect from 'components/FormSelect';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { MdLocationOn } from 'react-icons/md'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from 'features/user/userSlice';
import AddressForm from 'components/AddressForm';

function AddressTab() {
	const { user } = useSelector((state) => state.user);
	const [userInfo, setUserInfo] = useState({});
	const [addressData, setAddressData] = useState([]);
	const [districts, setDistricts] = useState([]);
	const [wards, setWards] = useState([]);

	function getAddressData() {
		axios.get('https://provinces.open-api.vn/api/?depth=3')
      .then((res) => setAddressData(res.data))
      .catch((err) => console.log(err))
	}

	function findAreaCode() {

	}

	const handleSubmit = (e) => {
	}

	useEffect(() => {
    getAddressData();
	}, []);

	return (
		<div className='personal-tab'>
			<h4 className='title'>Địa chỉ giao/nhận hàng</h4>
			{/* <form>
				<FormSelect
					name='province'
					value={values.province}
					handleChange={handleChange}
					labelText='Tỉnh/Thành phố'
					list={proviceList}
					icon={<MdLocationOn />}
				/>
				<FormSelect
					name='district'
					value={values.district}
					handleChange={handleChange}
					labelText='Quận/huyện'
					list={districtList}
					icon={<MdLocationOn />}
				/>
				<button className='btn' onClick={handleSubmit}>Cập nhật</button>
			</form> */}
			<AddressForm
				stateInfo={userInfo}
				setStateInfo={setUserInfo}
				cities={addressData}
				districts={districts}
				setDistricts={setDistricts}
				wards={wards}
				setWards={setWards}
				activeField={['city', 'district', 'province', 'addressDetail']}/>
			<button className='btn' onClick={handleSubmit}>Cập nhật</button>
		</div>
	)
}

export default AddressTab