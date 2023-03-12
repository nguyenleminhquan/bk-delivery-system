import { BsSearch, BsPencilSquare } from 'react-icons/bs'
import { useState, useEffect } from 'react'
import { BiPencil } from 'react-icons/bi'
import { AiOutlinePlusCircle, AiOutlineCloseCircle } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import styles from './CreateOrder.module.scss'
import { ATMMethodIcon, CODMethodIcon, MomoMethodIcon } from 'components/Icons'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { createOrder } from 'features/user/orderSlice'
import AddressForm from 'components/AddressForm'
import { toast } from 'react-toastify'
import { OrderStatus } from 'utils/enum'

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
    type: '',
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

const orderTypes = [
    {code: 'electronic', label: 'Điện tử'},
    {code: 'fragile', label: 'Dễ vỡ'},
    {code: 'food', label: 'Thức ăn'},
    {code: 'cloth', label: 'Quần áo'},
    {code: 'others', label: 'Còn lại'}
];

const recentlyAddress = [
    'Thanh Xuân, Hà Nội',
    'Ba Đình, Hà Nội',
    'Trần Duy Hưng, Hà Nội'
]

function CreateOrder() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);

    const [senderInfo, setSenderInfo] = useState(infoModel);
    const [receiverInfo, setReceiverInfo] = useState(infoModel);
    
    // address information
    const [senderDistricts, setSenderDistricts] = useState([]);
    const [receiverDistricts, setReceiverDistricts] = useState([]);
    const [senderWards, setSenderWards] = useState([]);
    const [receiverWards, setReceiverWards] = useState([]);
    const [address, setAddress] = useState([]);

    const [senderAddress, setSenderAddress] = useState('');

    const [editSender, setEditSender] = useState(false);
    const [products, setProducts] = useState([productModel]);

    const [note, setNote] = useState('');
    const [cod, setCod] = useState(0);

    const [paymentOption, setPaymentOption] = useState(paymentOptions[0].code);
    const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0].code);

    const [totalFee, setTotalFee] = useState(0);

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
        } else {
            toast.error('Vui lòng điền đủ thông tin sản phẩm trước khi điền sản phẩm mới.')
        }
    }

    const checkEmptyProductInfo = (product) => {
        return product.name === '' || product.weight === '' || product.quantity === '';
    }

    const handleSubmit = () => {
        const isEmptySenderInfo = Object.values(senderInfo).some(value => value === '');
        const isEmptyReceiverInfo = Object.values(receiverInfo).some(value => value === '');
        const isEmptyProduct = products.forEach(product => {
            if (Object.values(product).some(value => value === '')) {
                return true;
            }
        });
        // console.log(receiverInfo)
        // console.log('empty sender info: ', isEmptySenderInfo);
        // console.log('empty receiver info: ', isEmptyReceiverInfo);
        // if (isEmptySenderInfo || isEmptyReceiverInfo || isEmptyProduct) {
        //     alert('Chưa điền đầy đủ thông tin!');
        // } else {
        //     const payload = {
        //         sender_address: `${senderInfo.address}, ${senderInfo.ward}, ${senderInfo.district}, ${senderInfo.city}`,
        //         receiver_address: `${receiverInfo.address}, ${receiverInfo.ward}, ${receiverInfo.district}, ${receiverInfo.city}`,
        //         payment_type: paymentMethod,
        //         cod_amount: cod,
        //         note,
        //         status: 'WAITING',
        //         shipping_fee: calculateTotalFee(),
        //         user_id: user.id,
        //         items: products.map(product => ({
        //             name: product.name,
        //             quantity: product.quantity,
        //             type: product.type,
        //             weight: product.weight,
        //         }))
        //     }
        //     dispatch(createOrder(payload));
        // }

        const sender_address = `${user.fullname}, ${user.phone}, ${senderAddress}`;
        const receiver_address = (
            `${receiverInfo.fullname}, ` + 
            `${receiverInfo.phone}, ` +
            `${receiverInfo.address ?? receiverInfo.address}, ` + 
            `${receiverInfo.ward ?? receiverInfo.ward}, ` +
            `${receiverInfo.district ?? receiverInfo.district}, ` +
            receiverInfo.city ?? receiverInfo.city
        );

        const payload = {
            sender_address: `${senderInfo.address}, ${senderInfo.ward}, ${senderInfo.district}, ${senderInfo.city}`,
            receiver_address,
            payment_type: paymentMethod,
            cod_amount: cod,
            note,
            status: OrderStatus.PROCESSING,
            shipping_fee: calculateTotalFee(),
            user_id: user.id,
            items: products.map(product => ({
                name: product.name,
                quantity: product.quantity,
                type: product.type,
                weight: product.weight,
            }))
        }

        console.log(payload);
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

    const handleSaveSenderInfo = () => {
        if (editSender) {
            const address = `${senderInfo.address}, ${senderInfo.ward}, ${senderInfo.district}, ${senderInfo.city}`;
            setSenderAddress(address);
        }
        setEditSender(!editSender);
    }

    const handleRemoveProduct = (id) => {
        setProducts(prev => prev.filter((product, index) =>  index !== id));
    }

    useEffect(() => {
        if (products.at(-1).weight && products.at(-1).quantity) {
            const updated = calculateTotalFee() + parseInt(cod);
            setTotalFee(updated);
        } else {
            setTotalFee(parseInt(cod) || 0);
        }
    }, [cod, products])

    useEffect(() => {
        // Get sender info from user profile
        const addressArr = user.address.split(',');
        const reservedArr = [...addressArr].reverse();
        setSenderAddress(reservedArr.map((str, index) => 
            index === reservedArr.length - 1 ? str ?? '' : `${str ?? ''}, `
        ));
        setSenderInfo(prev => ({
            ...prev,
            city: addressArr[0] ?? '',
            district: addressArr[1] ?? '',
            ward: addressArr[2] ?? '',
            address: addressArr[3] ?? '',
            fullname: user.fullname,
            phone: user.phone,
        }))
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
                            <div className={`${styles.createOrderSection} row`}>
                                <div className="col-12">
                                    <div className={styles.title}>
                                        <span className='ms-2 me-3'>Bên gửi</span>
                                        <button className={styles.editBtn} onClick={() => handleSaveSenderInfo()}>
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
                                        <AddressForm 
                                            stateInfo={senderInfo}
                                            setStateInfo={setSenderInfo}
                                            cities={address}
                                            districts={senderDistricts}
                                            setDistricts={setSenderDistricts}
                                            wards={senderWards}
                                            setWards={setSenderWards}
                                            activeField={['city', 'district', 'province', 'address']}/>
                                        <div className="row mt-4">
                                            <div className="col-12 text-end">
                                                <button className='btn btn-medium me-3' onClick={() => setEditSender(!editSender)}>Save</button>
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
                                <AddressForm 
                                    stateInfo={receiverInfo}
                                    setStateInfo={setReceiverInfo}
                                    cities={address}
                                    districts={receiverDistricts}
                                    setDistricts={setReceiverDistricts}
                                    wards={receiverWards}
                                    setWards={setReceiverWards}
                                    activeField={['fullname', 'phone', 'city', 'district', 'province', 'address']}/>
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
                                                                    ? <option value={product.value}>{product.value}</option>
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
