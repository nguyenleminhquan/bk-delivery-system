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