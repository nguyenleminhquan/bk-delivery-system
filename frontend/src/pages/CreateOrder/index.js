import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { SocketContext } from 'index';

// Import icon
import { BsSearch, BsPencilSquare } from 'react-icons/bs';
import { BiPencil } from 'react-icons/bi';
import { AiOutlinePlusCircle, AiOutlineCloseCircle } from 'react-icons/ai';

import { createOrder } from 'features/user/orderSlice';
import { OrderStatus } from 'utils/enum';
import { paymentMethods, paymentOptions, orderTypes } from 'utils/constants';

import styles from './CreateOrder.module.scss';
import SearchAddress from 'components/SearchAddress';
import GeneralConfirm from 'components/GeneralConfirm';
import Paypal from 'components/Paypal';

const infoModel = {
    fullname: '',
    phone: '',
    address: '',
}

const productModel = {
    name: '',
    weight: '',
    quantity: '',
    // imgUrl: '',
    type: '',
}

const recentlyAddress = [
    'Thanh Xuân, Hà Nội',
    'Ba Đình, Hà Nội',
    'Trần Duy Hưng, Hà Nội'
]

function CreateOrder() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const { newOrder } = useSelector((state) => state.order);

    const [senderInfo, setSenderInfo] = useState(infoModel);
    const [receiverInfo, setReceiverInfo] = useState(infoModel);
    
    // address information
    const [senderAddress, setSenderAddress] = useState('');
    const [receiverAddress, setReceiverAddress] = useState('');

    const [editSender, setEditSender] = useState(false);
    const [products, setProducts] = useState([productModel]);

    const [note, setNote] = useState('');
    const [cod, setCod] = useState(0);

    const [paymentOption, setPaymentOption] = useState(paymentOptions[0].code);
    const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0].code);

    const [totalFee, setTotalFee] = useState(0);

    const socket = useContext(SocketContext);

    const [paypalPopup, setPaypalPopup] = useState(false);

    const handleChangeReceiverInfo = e => {
        const name = e.target.name;
        const value = e.target.value;
        setReceiverInfo(prev => ({...prev, [name]: value}));
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
        } else {
            toast.error('Vui lòng điền đủ thông tin sản phẩm trước khi điền sản phẩm mới.')
        }
    }

    const checkEmptyProductInfo = (product) => {
        return product.name === '' || product.weight === '' || product.quantity === '';
    }

    const isDisabledSubmit = () => {
        const isEmptySenderInfo = Object.values(senderInfo).some(value => value === '');
        const isEmptyReceiverInfo = Object.values(receiverInfo).some(value => value === '');
        const isEmptyProduct = Object.values(products.at(-1)).some(value => value === '');
        return isEmptySenderInfo || isEmptyReceiverInfo || isEmptyProduct;
    }

    const clearOrderState = () => {
        setReceiverInfo(infoModel);
        setProducts([productModel]);
        setReceiverAddress('');
    }

    const handleCreateOrder = () => {
        const orderPayload = {
            sender_name: senderInfo.fullname,
            sender_phone: senderInfo.phone,
            sender_address: senderAddress,
            receiver_name: receiverInfo.fullname,
            receiver_phone: receiverInfo.phone,
            receiver_address: receiverAddress,
            payment_type: paymentMethod,
            cod_amount: cod,
            note,
            status: OrderStatus.WAITING,
            shipping_fee: calculateTotalFee(),
            user_id: user.id,
            items: products.map(product => ({
                name: product.name,
                quantity: product.quantity,
                type: product.type,
                weight: product.weight,
            }))
        };
        const deliveryPayload = {
            status: OrderStatus.WAITING,
            area_code: user.area_code,
            type: 'inner',
            from: `${senderInfo.fullname}&${senderAddress}`,
            to: `stock_${user.area_code}`
        }
        dispatch(createOrder({ orderPayload, deliveryPayload, socket }));
        clearOrderState();
    }

    const handleSubmit = () => {
        if (isDisabledSubmit()) {
            toast.error('Chưa điền đầy đủ thông tin.');
        } else if (paymentMethod === 'paypal') {
            setPaypalPopup(true);
        } else {
            handleCreateOrder();
        }
    }

    const handleChangePaymentOption = e => {
        setPaymentOption(e.target.value);
        if (e.target.value === 'receiver') {
            setPaymentMethod('cod');
        }
    }

    const calculateTotalFee = () => {
        let totalWeight = 0;
        // get total weight
        if (products.length > 0) {
            totalWeight = products.reduce((cur, acc) => cur + acc.quantity * acc.weight, 0);
        }
        if (totalWeight <= 3000) {
            return 40000;
        } else {
            const curTotalWeight = totalWeight - 1000;
            return 40000 + Math.floor(curTotalWeight / 500)*5000 + ((curTotalWeight % 500) && 5000);
        }
    }

    const handleRemoveProduct = (id) => {
        setProducts(prev => prev.filter((product, index) =>  index !== id));
    }

    const handleUpdateSenderAddress = () => {
        if (senderAddress !== '') {
            setSenderInfo(prev => ({...prev, address: senderAddress}));
        }
        setEditSender(false);
    }

    useEffect(() => {
        setReceiverInfo(prev => ({...prev, address: receiverAddress}));
    }, [receiverAddress])

    useEffect(() => {
        if (products.at(-1).weight && products.at(-1).quantity) {
            const updated = calculateTotalFee() + parseInt(cod);
            setTotalFee(updated);
        } else {
            setTotalFee(parseInt(cod) || 0);
        }
    }, [cod, products])

    useEffect(() => {
        if (user?.address) {
            setSenderAddress(user?.address);
        } else {
            setEditSender(true);
        }
        setSenderInfo({
            fullname: user.fullname,
            phone: user.phone,
            address: user?.address
        });
    }, [])

    return (
        <div className={styles.wrapper}>
            {/* Header bar */}
            <div className='d-flex'>
                <div className={styles.searchBar}>
                    <BsSearch />
                    <input type="text" className='form-control ms-5' placeholder='Nhập mã đơn hàng' />
                </div>
                <Link className='btn fs-6' to="/create-order">
                    <BiPencil className='me-3'/> Tạo đơn hàng
                </Link>
            </div>
            <h2 className='pt-5 pb-3 fs-3'>Tạo đơn hàng mới</h2>
            <div className='flex-fill mx-100 overflow-auto'>
                <div className="container-fluid bg-white p-5">
                    <div className="row">
                        <div className="col-8">
                            <div className={`${styles.createOrderSection} row`}>
                                <div className="col-12">
                                    <div className={styles.title}>
                                        <span className='ms-2 me-3'>Bên gửi</span>
                                        <button className={styles.editBtn} onClick={() => setEditSender(!editSender)}>
                                            {!editSender && <BsPencilSquare />}
                                        </button>
                                    </div>
                                </div>
                                <div className="col-6 mt-2">
                                    <span className='fw-semibold'>{user.fullname} - {user.phone}</span>
                                    <p>{senderAddress}</p>
                                </div>
                                {editSender ? (
                                    <div className="col-6 mt-2">
                                        <SearchAddress address={senderAddress} setAddress={setSenderAddress} />
                                        <div className="row mt-4">
                                            <div className="col-12 text-end">
                                                {senderInfo?.address && (
                                                    <button className='btn btn-medium outline me-3' onClick={() => setEditSender(false)}>Hủy</button>
                                                )}
                                                <button className='btn btn-medium me-3' onClick={handleUpdateSenderAddress}>Lưu</button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="col-6 mt-2">
                                        <p className='fw-semibold'>Các địa chỉ gửi gần đây:</p>
                                        {recentlyAddress.map((address, index) => (
                                            <div className={styles.optionWrap} key={index}>
                                                <input type="radio" 
                                                    name='recentlyAddress'
                                                    className='me-3'
                                                    checked={address === senderAddress}
                                                    value={address}
                                                    onChange={e => setSenderAddress(e.target.value)}/> 
                                                <label htmlFor="recentlyAddress" className='ms-2' onClick={() => setSenderAddress(address)}>{address}</label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className={styles.createOrderSection}>
                                <div className={styles.title}>
                                    <span className='ms-2 me-3'>Bên nhận</span>
                                </div>
                                <form className='my-2'>
                                    <div className="form-group">
                                        <label>Họ và tên</label>
                                        <input type="text"
                                            name='fullname'
                                            placeholder='Nhập họ tên'
                                            value={receiverInfo.fullname}
                                            onChange={handleChangeReceiverInfo}/>
                                    </div>

                                    <div className="form-group">
                                        <label>Số điện thoại</label>
                                        <input type="text"
                                            name='phone'
                                            placeholder='Nhập số điện thoại'
                                            value={receiverInfo.phone}
                                            onChange={handleChangeReceiverInfo}/>
                                    </div>
                                </form>
                                <SearchAddress address={receiverAddress} setAddress={setReceiverAddress} />
                            </div>

                            <div className={styles.createOrderSection}>
                                <div className={styles.title}>
                                    <span className='ms-2 me-3'>Hàng hóa</span>
                                </div>
                                <div className={styles.content}>
                                    {products.map((product, index) => (
                                        <div key={index} className={styles.orderItem}>
                                            {/* <div className={styles.imageUpload}>
                                                <label htmlFor='file-input'>
                                                    <span className={styles.button}>Upload ảnh</span>
                                                </label>
                                                <input id="file-input" type="file" style={{display: 'none'}} />
                                            </div> */}

                                            <div className={styles.info}>
                                                <span className='fw-semibold'>{index+1}.&nbsp;</span>
                                                <div className="row">
                                                    <div className="col-4">
                                                        <div className='d-flex'>
                                                            <label className='fw-semibold me-1'>Tên</label>
                                                            <input type="text"
                                                                placeholder='Tên sản phẩm'
                                                                value={product.name}
                                                                onChange={e => handleUpdateProduct(e, index, 'name')}/>
                                                        </div>
                                                    </div>
                                                    <div className="col-3">
                                                        <div className='d-flex'>
                                                            <label className='fw-semibold me-1'>KL(gram)</label>
                                                            <input type="text" 
                                                                placeholder='0' 
                                                                value={product.weight}
                                                                onChange={e => handleUpdateProduct(e, index, 'weight')}/>
                                                        </div>
                                                    </div>
                                                    <div className="col-1">
                                                        <div className='d-flex'>
                                                            <label className='fw-semibold me-1'>SL</label>
                                                            <input type="text" 
                                                                placeholder='0'
                                                                value={product.quantity}
                                                                onChange={e => handleUpdateProduct(e, index, 'quantity')}/>
                                                        </div>
                                                    </div>
                                                    <div className="col-3">
                                                        <div className='d-flex'>
                                                            <label className='fw-semibold me-1'>Loại</label>
                                                            <select value={product.type}
                                                                onChange={e => handleUpdateProduct(e, index, 'type')}>
                                                                {product?.type 
                                                                    ? <option value={product.type}>{product.type}</option>
                                                                    : <option value="">--Loại--</option>
                                                                }
                                                                {orderTypes.map(item => (
                                                                    <option key={item.code} value={item.code}>{item.label}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="col-1">
                                                        <div className='d-flex flex-column'>
                                                            {products.length > 1 && (
                                                                <button className='flex-fill bg-white' onClick={() => handleRemoveProduct(index)}>
                                                                    <AiOutlineCloseCircle className={`${styles.addItemBtn} text-danger`}/>
                                                                </button>
                                                            )}
                                                            {index === products.length - 1 && (
                                                                <button className='flex-fill bg-white' onClick={handleAddProduct}>
                                                                    <AiOutlinePlusCircle className={styles.addItemBtn}/>
                                                                </button>
                                                            )}
                                                            <button></button>
                                                        </div>
                                                    </div>
                                                </div>
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
                                    <textarea cols="30"
                                        rows="5"
                                        value={note}
                                        onChange={e => setNote(e.target.value)}
                                        placeholder='Ghi chú cho đơn vị vận chuyển'></textarea>
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
                            
                            {paymentOption === 'receiver' && (
                                <div className={styles.createOrderSection}>
                                    <div className={styles.formGroup}>
                                        <label>Tổng tiền thu hộ COD</label>
                                        <input type="text" placeholder='0' value={cod} onChange={e => setCod(e.target.value)}/>
                                    </div>
                                </div>
                            )}
                            
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
                                    <h1 className={styles.importantLine}>{totalFee}đ</h1>
                                    <button className={styles.button} onClick={handleSubmit}>Tạo đơn</button>
                                    {/* <button className={styles.button} disabled={isDisabledSubmit()} onClick={handleSubmit}>Tạo đơn</button> */}
                                </div>
                            </div>
                        </div>
                    </div>  
                </div>
            </div>
            {
                paypalPopup &&
                <GeneralConfirm
                    title="Paypal"
                    message={<Paypal money_amount={totalFee} handleCreateOrder={handleCreateOrder} closePopup={() => setPaypalPopup(false)} />}
                    showConfirmButton={false}
                    cancelText="Đóng lại"
                    onCancel={() => setPaypalPopup(false)}
                />
            }
        </div>
    )
}

export default CreateOrder;
