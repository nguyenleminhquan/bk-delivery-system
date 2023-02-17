import { BsSearch, BsPencilSquare, BsCheckSquare } from 'react-icons/bs'
import { useState, useEffect, useLayoutEffect } from 'react'
import { BiPencil } from 'react-icons/bi'
import { AiOutlinePlusCircle } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import styles from './CreateOrder.module.scss'
import { ATMMethodIcon, CODMethodIcon, MomoMethodIcon } from 'components/Icons'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { createOrder } from 'features/user/orderSlice'

const senderModel = {
    fullname: 'Trần Phước Tài',
    phone: '0388284790',
    city: 'Thành phố Hồ Chí Minh',
    district: 'Thành phố Thủ Đức',
    ward: 'Phường Linh Trung',
    address: 'KTX khu A, ĐHQG Tp.HCM',
}

const receiverModel = {
    fullname: '',
    phone: '',
    city: '',
    district: '',
    ward: '',
    address: '',
}

const productModel = {
    name: '',
    weight: '',
    quantity: '',
    imgUrl: '',
}
const paymentOptions = [
    {code: 'sender', label: 'Người gửi thanh toán'},
    {code: 'receiver', label: 'Người nhận thanh toán'}
]

const paymentMethods = [
    {code: 'cod', label: 'Thanh toán trực tiếp', icon: <CODMethodIcon />},
    {code: 'momo', label: 'Momo', icon: <MomoMethodIcon />},
    {code: 'atm', label: 'Thẻ ATM nội địa', icon: <ATMMethodIcon />},
]

function CreateOrder() {
    const dispatch = useDispatch();

    const [editAddress, setEditAddress] = useState(false);
    const [senderInfo, setSenderInfo] = useState(null);
    const [receiverInfo, setReceiverInfo] = useState(receiverModel);
    const [productLists, setProductLists] = useState([productModel]);
    const [paymentOption, setPaymentOption] = useState(paymentOptions[0].code)
    const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0].code)

    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const _setSenderInfo = (field, event) => {
        setSenderInfo(prev => ({...prev, [field]: event.target.value}));
    }

    const handleChangePaymentOption = event => {
        setPaymentOption(event.target.value);
    }

    const handleChangePaymentMethod = event => {
        setPaymentMethod(event.target.value)
    }

    const handleSenderCityChange = event => {
        const selectedCity = event.target.value;
        const selectedIndex = event.target.options.selectedIndex;
        const cityName = event.target.options[selectedIndex].getAttribute('data-value');
        handleCityClick(selectedCity)
        setSenderInfo({
            ...senderInfo,
            city: selectedCity,
            district: '',
            ward: '',
        })
    }

    const handleSenderDistrictChange = event => {
        const selectedDistrict = event.target.value;
        const selectedIndex = event.target.options.selectedIndex;
        const districtName = event.target.options[selectedIndex].getAttribute('data-value');
        setSenderInfo({
            ...senderInfo,
            district: selectedDistrict,
            ward: '',
        });
        handleDistrictClick(selectedDistrict);
    }

    const handleSenderWardChange = event => {
        const selectedWard = event.target.value;
        const selectedIndex = event.target.options.selectedIndex;
        const wardName = event.target.options[selectedIndex].getAttribute('data-value');
        setSenderInfo({
            ...senderInfo,
            ward: selectedWard,
        });
    }

    const handleReceiverCityChange = event => {
        const selectedCity = event.target.value;
        const selectedIndex = event.target.options.selectedIndex;
        const cityName = event.target.options[selectedIndex].getAttribute('data-value');
        setReceiverInfo({
            ...receiverInfo,
            city: selectedCity,
            district: '',
            ward: '',
        })
        handleCityClick(selectedCity)
    }

    const handleReceiverDistrictChange = event => {
        const selectedDistrict = event.target.value;
        const selectedIndex = event.target.options.selectedIndex;
        const districtName = event.target.options[selectedIndex].getAttribute('data-value');
        setReceiverInfo({
            ...receiverInfo,
            district: selectedDistrict,
            ward: '',
        });
        handleDistrictClick(selectedDistrict);
    }

    const handleReceiverWardChange = event => {
        const selectedWard = event.target.value;
        const selectedIndex = event.target.options.selectedIndex;
        const wardName = event.target.options[selectedIndex].getAttribute('data-value');
        setReceiverInfo({
            ...receiverInfo,
            ward: selectedWard,
        });
    }

    const _setReceiverInfo = (field, event) => {
        setReceiverInfo(prev => ({...prev, [field]: event.target.value}));
    }

    const _setProduct = (attribute, e) => {
        const updatedProductList = productLists.map((product, index) => {
        if (index === parseInt(e.target.id)) {
            return {
                ...product,
                [attribute]: e.target.value
            };
          }
          return product;
        });

        setProductLists(updatedProductList);
    }

    const notCompleteOrder = () => {
        const lastProduct = productLists[productLists.length - 1];
        return (!lastProduct.name || !lastProduct.quantity || !lastProduct.weight);
    }

    const handleAddProduct = () => {
        if (!notCompleteOrder()) {
            setProductLists([...productLists, productModel]);
        }
    }

    const handleSubmit = () => {
        console.log('senderInfo', senderInfo);
        console.log('receiverInfo', receiverInfo);
        console.log('productInfo', productLists);
        console.log('paymentOption', paymentOption);
        console.log('paymentMethod', paymentMethod);
        // dispatch(createOrder({}));
    }

    const handleCityClick = (cityCode) => {
        axios.get(`https://provinces.open-api.vn/api/p/${cityCode}/?depth=2`)
        .then((res) => {
            console.log(res)
            setDistricts(res.data.districts);
          })
          .catch((err) => {
            console.log(err)
          })
    };

    const handleDistrictClick = (districtCode) => {
        axios.get(`https://provinces.open-api.vn/api/d/${districtCode}/?depth=2`)
        .then(res => {
            console.log(res);
            setWards(res.data.wards);
        })
        .catch(err => console.log(err))
    }

    const getCityData = () => {
        axios.get('https://provinces.open-api.vn/api/p/')
        .then(response => {
            setCities(response.data);
        })
        .catch(error => {
        console.log(error);
        });
    } 

    const calculateFee = () => {
        
    }

    // Set up sender info and get data for city
    useLayoutEffect(() => {
        setSenderInfo(senderModel);
        // if response = null -> setEdit(true)
        if (!senderInfo) {
            setEditAddress(true);
        }
        getCityData();
    }, [])
    return (
        <div className={styles.wrapper}>
            {/* Header bar */}
            <div className='d-flex'>
                <div className={styles.searchBar}>
                    <BsSearch />
                    <input type="text" className='form-control ms-5' placeholder='Nhập mã đơn hàng' />
                </div>
                <Link className='btn fs-4' to="/create-order">
                    <BiPencil className='me-3'/> Tạo đơn hàng
                </Link>
            </div>
            <h2 className='pt-5 pb-3 fs-1'>Tạo đơn hàng mới</h2>
            <div className='flex-fill mx-100 overflow-auto'>
                <div className="container-fluid bg-white p-5">
                    <div className="row">
                        <div className="col-8">
                            <div className={styles.createOrderSection}>
                                <div className={styles.title}>
                                    <span className='ms-2 me-3'>Bên gửi</span>
                                    <button className={styles.editBtn} onClick={() => setEditAddress(!editAddress)}>
                                        {editAddress ? <BsCheckSquare /> : <BsPencilSquare />}
                                    </button>
                                    
                                </div>
                                {(!editAddress) ? (
                                    <div className={styles.content}>
                                        <div className={styles.importantLine}>
                                            <span>{senderInfo?.fullname}</span> - <span>{senderInfo?.phone}</span>
                                        </div>
                                        <div className={styles.line}><span>{senderInfo?.address}</span></div>
                                    </div>
                                ) : (
                                    <form className='row m-1'>
                                        <div className="col-6">
                                            <div className={styles.formGroup}>
                                                <label>Họ tên</label>
                                                <input type="text" 
                                                    placeholder='Nhập họ tên' 
                                                    value={senderInfo?.fullname} 
                                                    onChange={e => _setSenderInfo('fullname', e)} />
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label>Số điện thoại</label>
                                                <input type="text" 
                                                    placeholder='Nhập số điện thoại'
                                                    value={senderInfo?.phone}
                                                    onChange={e => _setSenderInfo('phone', e)} />
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className={styles.formGroup}>
                                                <label>Tỉnh/Thành phố</label>
                                                {/* Use select */}
                                                <select
                                                    value={senderInfo?.city}
                                                    onChange={handleSenderCityChange}
                                                >
                                                    <option value="">-- Chọn thành phố --</option>
                                                    {cities.map(city => (
                                                        <option value={city.code} 
                                                            key={city.code}
                                                            data-value={city.name}
                                                        >{city.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label>Quận/Huyện</label>
                                                {/* Use select */}
                                                <select
                                                    value={senderInfo?.district}
                                                    onChange={handleSenderDistrictChange}
                                                >
                                                    <option value="">-- Chọn quận/huyện --</option>
                                                    {districts.map(district => (
                                                        <option value={district.code}
                                                            key={district.code}
                                                            data-value={district.name}
                                                        >{district.name}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label>Phường/Xã</label>
                                                {/* Use select */}
                                                <select
                                                    value={senderInfo?.ward}
                                                    onChange={handleSenderWardChange}
                                                >
                                                    <option value="">-- Chọn phường/xã --</option>
                                                    {wards.map(ward => (
                                                        <option value={ward.code}
                                                            key={ward.code}
                                                            data-value={ward.name}
                                                        >{ward.name}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label>Địa chỉ</label>
                                                <input type="text" 
                                                    placeholder='Nhập địa chỉ'
                                                    value={senderInfo?.address}
                                                    onChange={e => _setSenderInfo('address', e)}/>
                                            </div>
                                        </div>
                                    </form>
                                )}
                                
                            </div>

                            <div className={styles.createOrderSection}>
                                <div className={styles.title}>
                                    <span className='ms-2 me-3'>Bên nhận</span>
                                </div>
                                <form className='row m-1'>
                                    <div className="col-6">
                                        <div className={styles.formGroup}>
                                            <label>Họ tên</label>
                                            <input type="text" 
                                                placeholder='Nhập họ tên'
                                                value={receiverInfo?.fullname}
                                                onChange={e => _setReceiverInfo('fullname', e)}/>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Số điện thoại</label>
                                            <input type="text" 
                                                placeholder='Nhập số điện thoại' 
                                                value={receiverInfo?.phone}
                                                onChange={e => _setReceiverInfo('phone', e)}/>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className={styles.formGroup}>
                                            <label>Tỉnh/Thành phố</label>
                                            <select 
                                                value={receiverInfo?.city}
                                                onChange={handleReceiverCityChange}
                                            >
                                                <option value="">-- Chọn tỉnh/thành phố --</option>
                                                {cities.map(city => (
                                                    <option value={city.code} 
                                                        key={city.code}
                                                        data-value={city.name}
                                                    >{city.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Quận/Huyện</label>
                                            <select 
                                                value={receiverInfo?.district}
                                                onChange={handleReceiverDistrictChange}
                                            >
                                                <option value="">-- Chọn quận/huyện --</option>
                                                {districts.map(district => (
                                                    <option value={district.code} 
                                                        key={district.code}
                                                        data-value={district.name}
                                                    >{district.name}</option>
                                                ))} 
                                            </select>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Phường/Xã</label>
                                            <select 
                                                value={receiverInfo?.ward}
                                                onChange={handleReceiverWardChange}
                                            >
                                                <option value="">-- Chọn phường/xã --</option>
                                                {wards.map(ward => (
                                                    <option value={ward.code} 
                                                        key={ward.code}
                                                        data-value={ward.name}
                                                    >{ward.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Địa chỉ</label>
                                            <input type="text" placeholder='Nhập địa chỉ' />
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div className={styles.createOrderSection}>
                                <div className={styles.title}>
                                    <span className='ms-2 me-3'>Hàng hóa</span>
                                </div>
                                <div className={styles.content}>
                                    {productLists.map((item, index) => (
                                        <div className={notCompleteOrder() ? `${styles.orderItem} ${styles.notComplete}` : `${styles.orderItem}`} key={index}>
                                            <div className={styles.imageUpload}>
                                                <label htmlFor='file-input'>
                                                    <span className={styles.button}>Upload ảnh</span>
                                                </label>
                                                <input id="file-input" type="file" style={{display: 'none'}} />
                                            </div>

                                            <div className={styles.info}>
                                                <span className='fw-semibold'>{index + 1}. </span>
                                                <div className='d-flex ms-3'>
                                                    <label className='fw-semibold me-2'>Tên</label>
                                                    <input type="text"
                                                        placeholder='Nhập tên sản phẩm'
                                                        className={styles.mediumInput}
                                                        value={item.name}
                                                        onChange={e => _setProduct('name', e)}
                                                        id={index}/>
                                                </div>
                                                <div className='d-flex ms-3'>
                                                    <label className='fw-semibold me-2'>KL(gram)</label>
                                                    <input type="text" 
                                                        placeholder='0' 
                                                        className={styles.smallInput}
                                                        value={item?.weight}
                                                        id={index}
                                                        onChange={e => _setProduct('weight', e)} />
                                                </div>
                                                <div className='d-flex ms-3'>
                                                    <label className='fw-semibold me-2'>SL</label>
                                                    <input type="text" 
                                                        placeholder='0' 
                                                        className={styles.smallInput} 
                                                        value={item?.quantity}
                                                        id={index}
                                                        onChange={e => _setProduct('quantity', e)} />
                                                </div>
                                                <button className='flex-fill bg-white' onClick={handleAddProduct}>
                                                    <AiOutlinePlusCircle className={styles.addItemBtn}/>
                                                </button>
                                            </div>
                                        </div> 
                                    ))}
                                </div>  
                            </div>
                        </div>
                        <div className="col-4">
                            <div className={styles.createOrderSection}>
                                <div className={styles.formGroup}>
                                    <label>Mã giảm giá</label>
                                    <input type="text" placeholder='Nhập mã giảm giá'/>
                                </div>
                                <button className={styles.button}>Áp dụng</button>
                            </div>

                            <div className={styles.createOrderSection}>
                                <div className={styles.formGroup}>
                                    <label>Tùy chọn thanh toán</label>
                                    <select
                                        value={paymentOption[0].code}
                                        onChange={handleChangePaymentOption}
                                    >
                                        {paymentOptions.map(option => (
                                            <option value={option.code} key={option.code}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className={styles.createOrderSection}>
                                <div className={styles.formGroup}>
                                    <label>Phương thức thanh toán</label>
                                    {paymentMethods.map(method => (
                                        <label className={styles.optionWrap} key={method.code}>
                                            <input type="radio" 
                                                name='payment'
                                                className='me-3'
                                                value={method.code}
                                                checked={method.code === paymentMethod}
                                                onChange={handleChangePaymentMethod}/> 
                                            {method.icon}
                                            <span className='ms-2 fw-normal'>{method.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className={`${styles.createOrderSection} ${styles.lastSection}`}>
                                <div className={styles.content}>
                                    <h3>Tổng phí</h3>
                                    <h1 className={styles.importantLine}>0đ</h1>
                                    <button className={styles.button} onClick={handleSubmit}>Tạo đơn</button>
                                </div>
                            </div>
                        </div>
                    </div>  
                </div>
            </div>
        </div>
    )
}

export default CreateOrder;
