import React, { useEffect, useState } from 'react'
import styles from './FormInput.module.scss';

function FormInput({ name, type, value, handleChange, labelText, placeholderText, icon, errorMsg }) {
  const [error, setError] = useState(false);

  useEffect(() => {
    if (errorMsg) {
      setError(true);
    } else {
      setError(false);
    }
  }, [errorMsg])
  return (
    <div className={styles.formInput}>
        {
        labelText &&
        <label htmlFor={name}>
            {labelText}
        </label>
        }
        <div className={styles.inputBox}>
            {icon}
            <input
                type={type}
                name={name}
                value={value}
                placeholder={placeholderText}
                onChange={handleChange}
                className={error ? `${styles.inputField} ${styles.inputFieldError}` : styles.inputField}
            />
        </div>
        <span className={styles.errorMsg}>{errorMsg}</span>
    </div>
  )
}

export default FormInput