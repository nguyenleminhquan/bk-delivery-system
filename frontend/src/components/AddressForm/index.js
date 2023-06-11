import styles from './AddressForm.module.scss'

// Props contains: [stateInfo, setStateInfo], cities, districts, wards
function AddressForm({stateInfo, setStateInfo, cities, districts, setDistricts, wards, setWards, activeField, combination}) {
    const TagName = combination ? 'div' : 'form'
    const handleChangeInfo = (event) => {
        const key = event.target.name;
        const value = event.target.value;
        setStateInfo(prev => ({...prev, [key]: value}));
    }

    const findDistricts = city => {
        const result = cities.find(item => item.name === city);
        setDistricts(result.districts);
    }

    const findWards = district => {
        const result = districts.find(item => item.name === district);
        setWards(result.wards);
    }

    const handleChangeCity = event => {
        findDistricts(event.target.value);
        setStateInfo(prev => ({
            ...prev, 
            city: event.target.value,
            district: '',
            ward: ''
        }))
    }

    const handleChangeDistrict = event => {
        findWards(event.target.value);
        setStateInfo(prev => ({
            ...prev,
            district: event.target.value,
            ward: '',
        }))
    }

    const handleChangeWard = event => {
        setStateInfo(prev => ({...prev, ward: event.target.value }))
    }

    const isActiveField = (fieldName) => {
        return activeField?.find(field => field === fieldName);
    }

    const getFormLayout = () => {
        return combination
            ? ''
            : isActiveField('fullname') || isActiveField('phone') 
                ? 'col-6' 
                : 'col-12';
    }

    return (
        <TagName className={`mt-2 ${!combination && 'row'}`}>
            <div className={getFormLayout()}>
                {isActiveField('fullname') && (
                    <div className={styles.formGroup}>
                        <label>Họ tên</label>
                        <input type="text"
                            placeholder='Nhập họ tên'
                            value={stateInfo?.fullname}
                            name='fullname'
                            onChange={e => handleChangeInfo(e)}/>
                    </div>
                )}

                {isActiveField('phone') && (
                    <div className={styles.formGroup}>
                        <label>Số điện thoại</label>
                        <input type="text" 
                            placeholder='Nhập số điện thoại'
                            value={stateInfo?.phone}
                            name='phone'
                            onChange={e => handleChangeInfo(e)}/>
                    </div>
                )}

            </div>
            <div className={getFormLayout()}>
                {isActiveField('city') && (
                    <div className={styles.formGroup}>
                        <label>Tỉnh/Thành phố</label>
                        <select
                            value={stateInfo?.city ? stateInfo.city : ''}
                            onChange={handleChangeCity}
                        >
                            {stateInfo?.city
                                ? <option value={stateInfo.city}>{stateInfo.city}</option>
                                : <option value="">--Chọn tỉnh/thành phố--</option>}
                            {cities.map(item => (
                                <option key={item.code} value={item.name}>{item.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                {isActiveField('district') && (
                    <div className={styles.formGroup}>
                        <label>Quận/Huyện</label>
                        <select
                            value={stateInfo?.district ? stateInfo.district : ''}
                            onChange={handleChangeDistrict}>
                            {stateInfo.district
                                ? <option value={stateInfo.district}>{stateInfo.district}</option>
                                : <option value="">--Chọn quận/huyện--</option>}
                            {districts.map(item => (
                                <option key={item.code} value={item.name}>{item.name}</option>
                            ))} 
                        </select>
                    </div>
                )}

                {isActiveField('province') && (
                    <div className={styles.formGroup}>
                        <label>Phường/Xã</label>
                        <select
                            value={stateInfo?.ward ? stateInfo.ward : ''}
                            onChange={handleChangeWard}>
                            {stateInfo.ward
                                ? <option value={stateInfo.ward}>{stateInfo.ward}</option>
                                : <option value="">--Chọn phường/xã--</option>}
                            {wards.map(item => (
                                <option key={item.code} value={item.name}>{item.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                {isActiveField('addressDetail') && (
                    <div className={styles.formGroup}>
                        <label>Địa chỉ</label>
                        <input type="text"
                            placeholder='Nhập địa chỉ'
                            value={stateInfo?.addressDetail ? stateInfo.addressDetail : ''}
                            name='addressDetail'
                            onChange={e => handleChangeInfo(e)}/>
                    </div>
                )}
            </div>
        </TagName>
    );
}

export default AddressForm
