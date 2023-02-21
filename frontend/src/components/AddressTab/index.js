import FormSelect from 'components/FormSelect';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { MdLocationOn } from 'react-icons/md'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from 'features/user/userSlice';

function AddressTab() {
	const { user } = useSelector((state) => state.user);
	const address = user?.address;
  	const [values, setValues] = useState({
		province: address ? address.split(',')[0] : '',
    	district: address ? address.split(',')[1] : ''
	})
  	const [proviceList, setProvinceList] = useState([]);
  	const [districtList, setDistrictList] = useState([]);
	const dispatch = useDispatch();

	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setValues({ ...values, [name]: value });
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		const { province, district } = values;
		if (!province || !district) {
			toast.error('Please fill out all fields');
			return;
		};
		dispatch(updateUser({
			userId: user.id,
			info: {
				address: values.province + ',' + values.district
			}
		}))
	}

  useEffect(() => {
    axios.get('https://provinces.open-api.vn/api/?depth=1')
    .then((res) => {
      const data = res.data.map((item) => item.name)
      setProvinceList(data)
    })
    .catch((err) => {
      console.log(err)
    })
  }, [])

  useEffect(() => {
    axios.get('https://provinces.open-api.vn/api/?depth=2')
    .then((res) => {
      const data = res.data.find((item) => item.name === values.province).districts.map((item) => item.name)
      setDistrictList(data)
    })
    .catch((err) => {
      console.log(err)
    })
  }, [values.province])

	return (
		<div className='personal-tab'>
			<h4 className='title'>Địa chỉ giao hàng</h4>
			<form>
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
			</form>
		</div>
	)
}

export default AddressTab