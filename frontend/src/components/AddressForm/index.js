import SelectOption from 'components/SelectOption';
import styles from './AddressForm.module.scss';
import validator from "validator";
import { useEffect, useState } from 'react';

// Props contains: [stateInfo, setStateInfo], cities, districts, wards
function AddressForm({stateInfo, setStateInfo, cities, districts, setDistricts, wards, setWards, activeField, combination}) {
    const TagName = combination ? 'div' : 'form';
    const [citiesData, setCitiesData] = useState([]);
    const [districtsData, setDistrictsData] = useState([]);
    const [wardsData, setWardsData] = useState([]);
    const [errorMsg, setErrorMsg] = useState({
        phone: '',
        addressDetail: ''
    });
    const handleChangeInfo = (event) => {
        const key = event.target.name;
        const value = event.target.value;
        setStateInfo(prev => ({...prev, [key]: value}));
    }

    const handleValidate = event => {
        const key = event.target.name;
        const value = event.target.value;
        if (key == 'phone') {
            const validPhone = validator.isMobilePhone(value, 'vi-VN');
            if (validPhone || value.length === 0) {
                setErrorMsg(prev => ({...prev, phone: ''}));
            } else {
                setErrorMsg(prev => ({...prev, phone: 'Số điện thoại không hợp lệ'}));
            }
        }
    }

    const findDistricts = city => {
        const result = cities.find(item => item.name === city.value);
        setDistricts(result.districts);
    }

    const findWards = district => {
        const result = districts.find(item => item.name === district.value);
        setWards(result.wards);
    }

    const handleChangeCity = city => {
        findDistricts(city);
        setStateInfo(prev => ({
            ...prev, 
            city: city.value,
            district: '',
            ward: '',
            addressDetail: '',
        }))
    }

    const handleChangeDistrict = district => {
        findWards(district);
        setStateInfo(prev => ({
            ...prev,
            district: district.value,
            ward: '',
            addressDetail: '',
        }))
    }

    const handleChangeWard = ward => {
        setStateInfo(prev => ({...prev, ward: ward.value, addressDetail: '' }));
    }

    const isActiveField = (fieldName) => {
        return activeField?.find(field => field === fieldName);
    }

    const getFormLayout = () => {
        return combination
            ? ''
            : isActiveField('fullname') || isActiveField('phone') 
                ? 'col-12 col-sm-6' 
                : 'col-12';
    }

    function convertSelectOptions(data) {
        return data.map(item => ({label: item.name, value: item.name}));
    }

    useEffect(() => {
        if (cities) {
            setCitiesData(convertSelectOptions(cities));
        }
    }, [cities]);

    useEffect(() => {
        if (districts) {
            setDistrictsData(convertSelectOptions(districts));
        }
    }, [districts]);

    useEffect(() => {
        if (wards) {
            setWardsData(convertSelectOptions(wards));
        }
    }, [wards])

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
                            className={errorMsg['phone'] ? styles.error : ''}
                            onChange={e => handleChangeInfo(e)}
                            onBlur={e => handleValidate(e)}/>
                        <span className={styles.errorMsg}>{errorMsg['phone']}</span>
                    </div>
                )}

            </div>
            <div className={getFormLayout()}>
                {isActiveField('city') && (
                    <div className={styles.formGroup}>
                        <label>Tỉnh/Thành phố</label>
                        <SelectOption
                            options={citiesData}
                            value={stateInfo?.city ? {label: stateInfo.city, value: stateInfo.city} : null}
                            onChange={selectedCity => handleChangeCity(selectedCity)}
                            placeholder='Chọn thành phố'
                        />
                    </div>
                )}

                {isActiveField('district') && (
                    <div className={styles.formGroup}>
                        <label>Quận/Huyện</label>
                        <SelectOption
                            options={districtsData}
                            value={stateInfo?.district ? {label: stateInfo.district, value: stateInfo.district} : null}
                            onChange={selectedDistrict => handleChangeDistrict(selectedDistrict)}
                            placeholder='Chọn quận/huyện'
                        />
                    </div>
                )}

                {isActiveField('province') && (
                    <div className={styles.formGroup}>
                        <label>Phường/Xã</label>
                        <SelectOption
                            options={wardsData}
                            value={stateInfo?.ward ? {label: stateInfo.ward, value: stateInfo.ward} : null}
                            onChange={selectedWard => handleChangeWard(selectedWard)}
                            placeholder='Chọn phường/xã'
                        />
                    </div>
                )}

                {isActiveField('addressDetail') && (
                    <div className={styles.formGroup}>
                        <label>Số nhà, đường</label>
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
