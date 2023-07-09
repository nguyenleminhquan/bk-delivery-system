import FormSelect from 'components/FormSelect';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { MdLocationOn } from 'react-icons/md'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from 'features/user/userSlice';
import AddressForm from 'components/AddressForm';
import { AreaDelivery } from 'utils/consts';

function AddressTab() {
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.user);
	const [userInfo, setUserInfo] = useState(null);
	const [addressData, setAddressData] = useState([]);
	const [districts, setDistricts] = useState([]);
	const [wards, setWards] = useState([]);

	function getAddressData() {
		axios.get('https://provinces.open-api.vn/api/?depth=3')
      .then((res) => setAddressData(res.data))
      .catch((err) => console.log(err))
	}

	function findAreaCode() {
		return AreaDelivery.find(area => area.label === userInfo.city).code;
	}

	function generateFinalAddress() {
		return `${userInfo?.addressDetail}, ${userInfo?.ward}, ${userInfo?.district}, ${userInfo?.city}`
	}

	function setupAddress() {
		const parts = user.address.split(', ');
		const addressDetails = parts.slice(0, parts.length - 3);
		let addressDetail = '';
		addressDetails.forEach((ele, index) => {
			if (index !== addressDetails.length - 1) {
				addressDetail += `${ele}, `
			} else {
				addressDetail += ele;
			}
		});
		const addressObject = {
			addressDetail,
			ward: parts[parts.length - 3],
			district: parts[parts.length - 2],
			city: parts[parts.length - 1]
		};

		setUserInfo(addressObject);
	}

	const handleSubmit = (e) => {
		console.log(userInfo);
		if (!userInfo || (userInfo?.city === '' || userInfo?.district === '' || userInfo?.ward === '' || userInfo?.addressDetail === '')) {
			toast.error('Thiếu thông tin địa chỉ!');
		} else {
			const payload = {
				userId: user.id,
				info: {
					address: generateFinalAddress(),
					area_code: findAreaCode(),
				}
			}
			dispatch(updateUser(payload));
		}
	}

	useEffect(() => {
		if (user.address) {
			setupAddress();
		}
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