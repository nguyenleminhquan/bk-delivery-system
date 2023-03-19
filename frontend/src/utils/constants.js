import { AiOutlineHistory } from 'react-icons/ai'
import { BiLogOut } from 'react-icons/bi'
import { BsPersonCircle } from 'react-icons/bs'
import { FaAddressCard, FaChartBar, FaEnvelope, FaHistory, FaHome, FaListUl, FaLock, FaPhone, FaUser, FaWarehouse} from 'react-icons/fa'
import { IoMdNotificationsOutline } from 'react-icons/io'
import {CODMethodIcon, MomoMethodIcon, ATMMethodIcon } from '../components/Icons';

export const loginFields = (values) => [
    {
        id: 1,
        type: 'text',
        name: 'email',
        placeholderText: 'Email',
        value: values.email,
        icon: <FaEnvelope />
    },
    {
        id: 2,
        type: 'password',
        name: 'password',
        placeholderText: 'Mật khẩu',
        value: values.password,
        icon: <FaLock />
    },
]

export const registerFields = (values) => [
    {
        id: 1,
        type: 'text',
        name: 'fullname',
        placeholderText: 'Họ và tên',
        value: values.fullname,
        icon: <FaUser />
    },
    {
        id: 2,
        type: 'text',
        name: 'email',
        placeholderText: 'Email',
        value: values.email,
        icon: <FaEnvelope />
    },
    {
        id: 3,
        type: 'tel',
        name: 'phone',
        placeholderText: 'Số điện thoại',
        value: values.phone,
        icon: <FaPhone />
    },
    {
        id: 4,
        type: 'password',
        name: 'password',
        placeholderText: 'Mật khẩu',
        value: values.password,
        icon: <FaLock />
    },
    {
        id: 5,
        type: 'password',
        name: 'passwordc',
        placeholderText: 'Nhập lại mật khẩu',
        value: values.passwordc,
        icon: <FaLock />
    },
]

export const profileTabs = [
    {
        id: 1,
        name: 'personal',
        value: 'Thông tin cá nhân'
    },
    {
        id: 2,
        name: 'address',
        value: 'Địa chỉ'
    },
    {
        id: 3,
        name: 'bank-account',
        value: 'Tài khoản ngân hàng'
    },
    {
        id: 4,
        name: 'change-password',
        value: 'Đổi mật khẩu'
    },
]

export const personalTabFields = (values) => [
    {
        id: 1,
        type: 'text',
        name: 'fullname',
        placeholderText: 'Họ và tên',
        value: values.fullname,
        icon: <FaUser />,
        label: 'Họ và tên'
    },
    {
        id: 2,
        type: 'text',
        name: 'email',
        placeholderText: 'Email',
        value: values.email,
        icon: <FaEnvelope />,
        label: 'Email'
    },
    {
        id: 3,
        type: 'tel',
        name: 'phone',
        placeholderText: 'Số điện thoại',
        value: values.phone,
        icon: <FaPhone />,
        label: 'Số điện thoại'
    },
]

export const changePassTabFields = (values) => [
    {
        id: 1,
        type: 'password',
        name: 'oldPass',
        placeholderText: 'Nhập mật khẩu cũ',
        value: values.oldPass,
        icon: <FaLock />,
        label: 'Mật khẩu cũ'
    },
    {
        id: 2,
        type: 'password',
        name: 'newPass',
        placeholderText: 'Nhập mật khẩu mới',
        value: values.newPass,
        icon: <FaLock />,
        label: 'Mật khẩu mới'
    },
    {
        id: 3,
        type: 'password',
        name: 'newPassc',
        placeholderText: 'Nhập lại mật khẩu mới',
        value: values.newPassc,
        icon: <FaLock />,
        label: 'Xác nhận mật khẩu mới'
    },
]

export const bankList = [
    'Ngân hàng ngoại thương Việt Nam(VietcomBank)',
    'Ngân hàng Đầu tư và Phát triển VN (BIDV)',
    'NH Chính sách xã hội (VBSP)',
    'NH Công thương VN (Vietinbank)',
    'NH Nông nghiệp&PT Nông thôn VN-AGribank',
]

export const senderSidebar = [
    {
        id: 1,
        path: '/request',
        icon: <AiOutlineHistory />,
        text: 'Yêu cầu xử lí',
        type: 'above'
    },
    {
        id: 2,
        path: '/notification',
        icon: <IoMdNotificationsOutline />,
        text: 'Thông báo',
        type: 'above'
    },
    {
        id: 3,
        path: '/logout',
        icon: <BiLogOut />,
        text: 'Đăng xuất',
        type: 'above'
    },
    {
        id: 4,
        path: '/',
        icon: <FaHome />,
        text: 'Trang chủ',
        type: 'beneath'
    },
    {
        id: 5,
        path: '/cod',
        icon: <FaAddressCard />,
        text: 'Đối soát COD',
        type: 'beneath'
    },
    {
        id: 6,
        path: '/profile',
        icon: <BsPersonCircle />,
        text: 'Thông tin cá nhân',
        type: 'beneath'
    },
];

export const driverSidebar = [
    {
        id: 1,
        path: '/request',
        icon: <AiOutlineHistory />,
        text: 'Yêu cầu xử lí',
        type: 'above'
    },
    {
        id: 2,
        path: '/notification',
        icon: <IoMdNotificationsOutline />,
        text: 'Thông báo',
        type: 'above'
    },
    {
        id: 3,
        path: '/logout',
        icon: <BiLogOut />,
        text: 'Đăng xuất',
        type: 'above'
    },
    {
        id: 4,
        path: '/',
        icon: <FaListUl />,
        text: 'Đơn hàng thực hiện',
        type: 'beneath'
    },
    {
        id: 5,
        path: '/delivery-history',
        icon: <FaHistory />,
        text: 'Lịch sử giao nhận',
        type: 'beneath'
    },
    {
        id: 6,
        path: '/profile',
        icon: <BsPersonCircle />,
        text: 'Thông tin cá nhân',
        type: 'beneath'
    },
]

export const stockerSidebar = [
    {
        id: 1,
        path: '/request',
        icon: <AiOutlineHistory />,
        text: 'Yêu cầu xử lí',
        type: 'above'
    },
    {
        id: 2,
        path: '/notification',
        icon: <IoMdNotificationsOutline />,
        text: 'Thông báo',
        type: 'above'
    },
    {
        id: 3,
        path: '/logout',
        icon: <BiLogOut />,
        text: 'Đăng xuất',
        type: 'above'
    },
    {
        id: 4,
        path: '/',
        icon: <FaHome />,
        text: 'Trang chủ',
        type: 'beneath'
    },
    // {
    //     id: 5,
    //     path: '/delivery-history',
    //     icon: <FaAddressCard />,
    //     text: 'Lịch sử giao nhận',
    //     type: 'beneath'
    // },
    {
        id: 6,
        path: '/profile',
        icon: <BsPersonCircle />,
        text: 'Thông tin cá nhân',
        type: 'beneath'
    },
]

export const adminSidebar = [
    {
        id: 1,
        path: '/request',
        icon: <AiOutlineHistory />,
        text: 'Yêu cầu xử lí',
        type: 'above'
    },
    {
        id: 2,
        path: '/notification',
        icon: <IoMdNotificationsOutline />,
        text: 'Thông báo',
        type: 'above'
    },
    {
        id: 3,
        path: '/logout',
        icon: <BiLogOut />,
        text: 'Đăng xuất',
        type: 'above'
    },
    {
        id: 4,
        path: '/',
        icon: <FaChartBar />,
        text: 'Thống kê',
        type: 'beneath'
    },
    {
        id: 5,
        path: '/cod',
        icon: <FaAddressCard />,
        text: 'Đối soát COD',
        type: 'beneath'
    },
    {
        id: 6,
        path: '/employee-management',
        icon: <BsPersonCircle />,
        text: 'Quản lý nhân viên',
        type: 'beneath'
    },
    {
        id: 7,
        path: '/stock-management',
        icon: <FaWarehouse />,
        text: 'Quản lý kho',
        type: 'beneath'
    },
]

export const paymentMethods = [
    { code: 'cod', label: 'Thanh toán trực tiếp', icon: <CODMethodIcon /> },
    { code: 'momo', label: 'Momo', icon: <MomoMethodIcon /> },
    { code: 'atm', label: 'Thẻ ATM nội địa', icon: <ATMMethodIcon /> },
]

export const paymentOptions = [
    { code: 'sender', label: 'Người gửi thanh toán' },
    { code: 'receiver', label: 'Người nhận thanh toán' }
]

export const orderTypes = [
    { code: 'electronic', label: 'Điện tử' },
    { code: 'fragile', label: 'Dễ vỡ' },
    { code: 'food', label: 'Thức ăn' },
    { code: 'cloth', label: 'Quần áo' },
    { code: 'others', label: 'Còn lại' }
];

export const orderStatusList = {
    "waiting": 'Đơn hàng đang được xử lý',
    "accepted": 'Đơn hàng đã được chấp nhận',
    "picked": "Đã lấy hàng và đang đến kho nguồn",
    "arrived_send_stock": "Đã đến kho nguồn",
    "import": "Đã nhập kho",
    "coming_dest_stock": "Đang đến kho đích",
    "arrived_dest_stock": "Đã đến kho đích",
    "delivering": "Đang giao đến người nhận",
    "success": "Giao hàng đến người nhận thành công",
}
