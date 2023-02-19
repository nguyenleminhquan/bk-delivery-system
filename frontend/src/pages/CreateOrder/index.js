import { BsSearch, BsPencilSquare, BsCheckSquare } from 'react-icons/bs'
import { useState, useEffect } from 'react'
import { BiPencil } from 'react-icons/bi'
import { AiOutlinePlusCircle } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import styles from './CreateOrder.module.scss'
import { ATMMethodIcon, CODMethodIcon, MomoMethodIcon } from 'components/Icons'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { createOrder } from 'features/user/orderSlice'

const infoModel = {
    fullname: '',
    phone: '',
    city: '',
    district: '',
    ward: '',
    address: '',
}

// const productModel = {
//     name: '',
//     weight: '',
//     quantity: '',
//     imgUrl: '',
// }
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
    const [senderInfo, setSenderInfo] = useState(infoModel);
    const [receiverInfo, setReceiverInfo] = useState(infoModel)
    
    // address information
    const [senderDistricts, setSenderDistricts] = useState([]);
    const [receiverDistricts, setReceiverDistricts] = useState([]);
    const [senderWards, setSenderWards] = useState([]);
    const [receiverWards, setReceiverWards] = useState([]);
    const [address, setAddress] = useState([]);


    const handleChangeInfo = (event, setState, field) => {
        const value = event.target.value;
        setState(prev => ({...prev, [field]: value}));
    }

    const getAddress = () => {
        axios.get('https://provinces.open-api.vn/api/?depth=3')
            .then(res => setAddress(res.data))
            .catch(error => console.log(error))
    }

    // For sender only
    const findSenderDistricts = city => {
        const result = address.find(item => item.name === city);
        setSenderDistricts(result.districts);
    }

    const findSenderWards = district => {
        const result = senderDistricts.find(item => item.name === district);
        setSenderWards(result.wards);
    }

    const handleChangeSenderCity = e => {
        findSenderDistricts(e.target.value);
        setSenderInfo(prev => ({
            ...prev, 
            city: e.target.value,
            district: '',
            ward: ''
        }))
    }

    const handleChangeSenderDistrict = e => {
        findSenderWards(e.target.value);
        setSenderInfo(prev => ({
            ...prev,
            district: e.target.value,
            ward: '',
        }))
    }

    const handleChangeSenderWard = e => {
        setSenderInfo(prev => ({...prev, ward: e.target.value }))
    }

    // For receiver only
    const findReceiverDistricts = city => {
        const result = address.find(item => item.name === city);
        setReceiverDistricts(result.districts);
    }

    const findReceiverWards = district => {
        const result = receiverDistricts.find(item => item.name === district);
        setReceiverWards(result.wards);
    }

    const handleChangeReceiverCity = e => {
        findReceiverDistricts(e.target.value);
        setReceiverInfo(prev => ({
            ...prev, 
            city: e.target.value,
            district: '',
            ward: ''
        }))
    }

    const handleChangeReceiverDistrict = e => {
        findReceiverWards(e.target.value);
        setReceiverInfo(prev => ({
            ...prev,
            district: e.target.value,
            ward: '',
        }))
    }

    const handleChangeReceiverWard = e => {
        setReceiverInfo(prev => ({...prev, ward: e.target.value }))
    }

    const handleSubmit = () => {
        // Check empty field
        // const emptySenderInfo = Object.values(senderInfo).some(x => x === '');
        
    }

    useEffect(() => {
        // Get sender info from user profile
        // Todo..

        getAddress();
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
                                    <button className={styles.editBtn}>
                                        {/* {editAddress ? <BsCheckSquare /> : <BsPencilSquare />} */}
                                    </button>
                                    
                                </div>
                                <form className='row m-1'>
                                    <div className="col-6">
                                        <div className={styles.formGroup}>
                                            <label>Họ tên</label>
                                            <input type="text"
                                                placeholder='Nhập họ tên'
                                                value={senderInfo?.fullname}
                                                onChange={e => handleChangeInfo(e, setSenderInfo, 'fullname')}/>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Số điện thoại</label>
                                            <input type="text" 
                                                placeholder='Nhập số điện thoại'
                                                value={senderInfo?.phone}
                                                onChange={e => handleChangeInfo(e, setSenderInfo, 'phone')}/>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className={styles.formGroup}>
                                            <label>Tỉnh/Thành phố</label>
                                            <select
                                                value={senderInfo?.city ? senderInfo.city : ''}
                                                onChange={handleChangeSenderCity}
                                            >
                                                {senderInfo?.city
                                                    ? <option value={senderInfo.city}>{senderInfo.city}</option>
                                                    : <option value="">--Chọn tỉnh/thành phố--</option>}
                                                {address.map(item => (
                                                    <option key={item.code} value={item.name}>{item.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Quận/Huyện</label>
                                            <select
                                                value={senderInfo?.district ? senderInfo.district : ''}
                                                onChange={handleChangeSenderDistrict}>
                                                {senderInfo.district
                                                    ? <option value={senderInfo.district}>{senderInfo.district}</option>
                                                    : <option value="">--Chọn quận/huyện</option>}
                                                {senderDistricts.map(item => (
                                                    <option key={item.code} value={item.name}>{item.name}</option>
                                                ))} 
                                            </select>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Phường/Xã</label>
                                            <select
                                                value={senderInfo?.ward ? senderInfo.ward : ''}
                                                onChange={handleChangeSenderWard}>
                                                {senderInfo.ward
                                                    ? <option value={senderInfo.ward}>{senderInfo.ward}</option>
                                                    : <option value="">--Chọn phường/xã</option>}
                                                {senderWards.map(item => (
                                                    <option key={item.code} value={item.name}>{item.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Địa chỉ</label>
                                            <input type="text"
                                                placeholder='Nhập địa chỉ'
                                                value={senderInfo?.address}
                                                onChange={e => handleChangeInfo(e, setSenderInfo, 'address')}/>
                                        </div>
                                    </div>
                                </form>
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
                                                onChange={e => handleChangeInfo(e, setReceiverInfo, 'fullname')}/>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Số điện thoại</label>
                                            <input type="text" 
                                                placeholder='Nhập số điện thoại'
                                                value={receiverInfo?.phone}
                                                onChange={e => handleChangeInfo(e, setReceiverInfo, 'phone')}/>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className={styles.formGroup}>
                                            <label>Tỉnh/Thành phố</label>
                                            <select value={receiverInfo?.city ? receiverInfo.city : ""}
                                                onChange={handleChangeReceiverCity}>
                                                {receiverInfo?.city
                                                    ? <option value={receiverInfo.city}>{receiverInfo.city}</option>
                                                    : <option value="">-- Chọn tỉnh/thành phố --</option>}
                                                {address.map(item => (
                                                    <option key={item.name} value={item.name}>{item.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Quận/Huyện</label>
                                            <select value={receiverInfo?.district ? receiverInfo.district : ""}
                                                onChange={handleChangeReceiverDistrict}>
                                                {receiverInfo?.district
                                                    ? <option value={receiverInfo.district}>{receiverInfo.district}</option>
                                                    : <option value="">-- Chọn quận/huyện --</option>}
                                                {receiverDistricts.map(item => (
                                                    <option key={item.code} value={item.name}>{item.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Phường/Xã</label>
                                            <select value={receiverInfo?.ward ? receiverInfo.ward : ""}
                                                onChange={handleChangeReceiverWard}>
                                                {receiverInfo?.ward
                                                    ? <option key={receiverInfo.ward}>{receiverInfo.ward}</option>
                                                    : <option value="">-- Chọn phường/xã --</option>}
                                                {receiverWards.map(item => (
                                                    <option key={item.code} value={item.name}>{item.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Địa chỉ</label>
                                            <input type="text" placeholder='Nhập địa chỉ' 
                                                value={receiverInfo?.address}
                                                onChange={e => handleChangeInfo(e, setReceiverInfo, 'address')}/>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div className={styles.createOrderSection}>
                                <div className={styles.title}>
                                    <span className='ms-2 me-3'>Hàng hóa</span>
                                </div>
                                <div className={styles.content}>
                                    <div className={styles.orderItem}>
                                        <div className={styles.imageUpload}>
                                            <label htmlFor='file-input'>
                                                <span className={styles.button}>Upload ảnh</span>
                                            </label>
                                            <input id="file-input" type="file" style={{display: 'none'}} />
                                        </div>

                                        <div className={styles.info}>
                                            <span className='fw-semibold'>1. </span>
                                            <div className='d-flex ms-3'>
                                                <label className='fw-semibold me-2'>Tên</label>
                                                <input type="text"
                                                    placeholder='Nhập tên sản phẩm'
                                                    className={styles.mediumInput}/>
                                            </div>
                                            <div className='d-flex ms-3'>
                                                <label className='fw-semibold me-2'>KL(gram)</label>
                                                <input type="text" 
                                                    placeholder='0' 
                                                    className={styles.smallInput} />
                                            </div>
                                            <div className='d-flex ms-3'>
                                                <label className='fw-semibold me-2'>SL</label>
                                                <input type="text" 
                                                    placeholder='0' 
                                                    className={styles.smallInput}/>
                                            </div>
                                            <button className='flex-fill bg-white'>
                                                <AiOutlinePlusCircle className={styles.addItemBtn}/>
                                            </button>
                                        </div>
                                    </div> 
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
                                    <select>
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
                                                value={method.code}/> 
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
