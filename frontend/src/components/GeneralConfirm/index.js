import React, { useState } from 'react';
import styles from './GeneralConfirm.module.scss';

function GeneralConfirm(props) {
  const [formData, setFormData] = useState({});

  const handleInputChange = (event) => {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    setFormData({...formData, [name]: value});
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (props.onConfirm) {
      props.onConfirm(formData);
    }
  }

  return (
    <div className={styles.modal}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span>{props.title}</span>
        </div>
        <div className={styles.body}>
          {props.children}
          {props.showForm &&
            <form>
              {props.formFields.map((field) => (
                <div className={styles.formGroup} key={field.name}>
                  <label>{field.label}</label>
                  {field.type === 'select' ? (
                    <select name={field.name} onChange={handleInputChange}>
                    {field.models.map(item => (
                        <option value={item.code} key={item.code}>{item.label}</option>
                    ))}
                    </select>
                  ) : (
                    <input type={field.type} name={field.name} onChange={handleInputChange} />
                  )}
                </div>
              ))}
            </form>
          }
        </div>
        
        <div className={styles.footer}>
          <button onClick={props.onCancel} className='btn btn-medium bg-secondary'>{props.cancelText}</button>
          {props.showConfirmButton &&
            <button onClick={props.onConfirm}>{props.confirmText}</button>
          }
          {props.showForm && <button onClick={handleSubmit} className="btn btn-medium ms-1">{props.formSubmitText}</button>}
        </div>
      </div>
    </div>
  );
}

export default GeneralConfirm;
