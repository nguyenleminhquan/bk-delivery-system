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
import AddressForm from 'components/AddressForm'

const infoModel = {
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
    cod: '',
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
    const [senderInfo, setSenderInfo] = useState(infoModel);
    const [receiverInfo, setReceiverInfo] = useState(infoModel);
    
    // address information
    const [senderDistricts, setSenderDistricts] = useState([]);
    const [receiverDistricts, setReceiverDistricts] = useState([]);
    const [senderWards, setSenderWards] = useState([]);
    const [receiverWards, setReceiverWards] = useState([]);
    const [address, setAddress] = useState([]);

    const [products, setProducts] = useState([productModel]);

    const [paymentOption, setPaymentOption] = useState(paymentOptions[0].code);
    const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0].code);

    const getAddress = () => {
        axios.get('https://provinces.open-api.vn/api/?depth=3')
            .then(res => setAddress(res.data))
            .catch(error => console.log(error))
    }

    const handleUpdateProduct = (e, index, field) => {
        const value = e.target.value;
        setProducts(products.map((product, idx) => {
            if (index === idx) {
                return {...product, [field]: value};
            }
            return product;
        }));
    }

    const handleAddProduct = () => {
        const lastProduct = products.at(-1);
        if (!checkEmptyProductInfo(lastProduct)) {
            setProducts(prev => [...prev, productModel])
        }
    }

    const checkEmptyProductInfo = (product) => {
        return product.name === '' || product.weight === '' || product.quantity === '';
    }

    const handleSubmit = () => {
        console.log('Sender info: ', senderInfo);
        console.log('Receiver Info: ', receiverInfo);
        console.log('Product info: ', products);
        console.log('Payment option: ', paymentOption);
        console.log('Payment method: ', paymentMethod);
    }

    const handleChangePaymentOption = e => {
        setPaymentOption(e.target.value);
        if (e.target.value === 'receiver') {
            setPaymentMethod('cod');
        }
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
                                <AddressForm 
                                    stateInfo={senderInfo}
                                    setStateInfo={setSenderInfo}
                                    cities={address}
                                    districts={senderDistricts}
                                    setDistricts={setSenderDistricts}
                                    wards={senderWards}
                                    setWards={setSenderWards}/>
                            </div>

                            <div className={styles.createOrderSection}>
                                <div className={styles.title}>
                                    <span className='ms-2 me-3'>Bên nhận</span>
                                </div>
                                <AddressForm 
                                    stateInfo={receiverInfo}
                                    setStateInfo={setReceiverInfo}
                                    cities={address}
                                    districts={receiverDistricts}
                                    setDistricts={setReceiverDistricts}
                                    wards={receiverWards}
                                    setWards={setReceiverWards}/>
                            </div>

                            <div className={styles.createOrderSection}>
                                <div className={styles.title}>
                                    <span className='ms-2 me-3'>Hàng hóa</span>
                                </div>
                                <div className={styles.content}>
                                    {products.map((product, index) => (
                                        <div key={index} className={styles.orderItem}>
                                            <div className={styles.imageUpload}>
                                                <label htmlFor='file-input'>
                                                    <span className={styles.button}>Upload ảnh</span>
                                                </label>
                                                <input id="file-input" type="file" style={{display: 'none'}} />
                                            </div>

                                            <div className={styles.info}>
                                                <span className='fw-semibold'>{index+1}. </span>
                                                <div className='d-flex ms-3'>
                                                    <label className='fw-semibold me-2'>Tên</label>
                                                    <input type="text"
                                                        placeholder='Nhập tên sản phẩm'
                                                        className={styles.mediumInput}
                                                        value={product.name}
                                                        onChange={e => handleUpdateProduct(e, index, 'name')}/>
                                                </div>
                                                <div className='d-flex ms-3'>
                                                    <label className='fw-semibold me-2'>KL(gram)</label>
                                                    <input type="text" 
                                                        placeholder='0' 
                                                        className={styles.smallInput}
                                                        value={product.weight}
                                                        onChange={e => handleUpdateProduct(e, index, 'weight')}/>
                                                </div>
                                                <div className='d-flex ms-3'>
                                                    <label className='fw-semibold me-2'>SL</label>
                                                    <input type="text" 
                                                        placeholder='0'
                                                        className={styles.extraSmallInput}
                                                        value={product.quantity}
                                                        onChange={e => handleUpdateProduct(e, index, 'quantity')}/>
                                                </div>
                                                <div className='d-flex ms-3'>
                                                    <label className='fw-semibold me-2'>COD</label>
                                                    <input type="text" 
                                                        placeholder='0'
                                                        className={styles.smallInput}
                                                        value={product.cod}
                                                        onChange={e => handleUpdateProduct(e, index, 'cod')}/>
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
                                    <label>Ghi chú</label>
                                    <textarea cols="30" rows="5" placeholder='Ghi chú cho đơn vị vận chuyển'></textarea>
                                    {/* <input type="text" placeholder=''/> */}
                                </div>
                            </div>

                            <div className={styles.createOrderSection}>
                                <div className={styles.formGroup}>
                                    <label>Tùy chọn thanh toán</label>
                                    <select value={paymentOption}
                                        onChange={handleChangePaymentOption}>
                                        {paymentOptions.map(option => (
                                            <option value={option.code} key={option.code}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            
                            {paymentOption === 'sender' && (
                                <div className={styles.createOrderSection}>
                                    <div className={styles.formGroup}>
                                        <label>Phương thức thanh toán</label>
                                        {paymentMethods.map(method => (
                                        <div className={styles.optionWrap} key={method.code}>
                                            <input type="radio" 
                                                name='payment'
                                                className='me-3'
                                                checked={method.code === paymentMethod}
                                                value={method.code}
                                                onChange={e => setPaymentMethod(e.target.value)}/> 
                                            {method.icon}
                                            <label htmlFor="payment" className='ms-2' onClick={() =>setPaymentMethod(method.code)}>{method.label}</label>
                                        </div>
                                    ))}
                                    </div>
                                </div>
                            )}
                            

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
