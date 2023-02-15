import validator from "validator";

export const validateForm = (formData, setState) => {
    if (formData?.email) {
        if (!validator.isEmail(formData.email)) {
            setState(prev => prev.map(item => {
                if (item.name === 'email') {
                    return {...item, msg: 'Email is invalid'}
                } 
                return item;
            }))
        }
    }
    if (formData?.phone) {
        if (!validator.isMobilePhone(formData.phone, 'vi-VN')) {
            setState(prev => prev.map(item => {
                if (item.name === 'phone') {
                    return {...item, msg: 'Phone is invalid'}
                }
                return item;
            }))
        }
    }
    if ((formData?.password && formData?.passwordc) || formData?.password) {
        if (!validator.equals(formData.password, formData.passwordc)) {
            setState(prev => prev.map(item => {
                if (item.name === 'passwordc') {
                    return {...item, msg: `Password doesn't match`}
                }
                return item;
            }))
        }
        if (!validator?.isLength(formData?.password, {min: 8, max: 64})) {
            setState(prev => prev.map(item => {
                if (item.name === 'password') {
                    return {...item, msg: `Password must be 8-64 characters`}
                }
                return item;
            }))
        }
    }

}

export const isErrorMsgEmpty = state => {
    return state.every(error => !error?.msg);
}