import { FaEnvelope, FaLock, FaPhone, FaUser} from 'react-icons/fa'

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