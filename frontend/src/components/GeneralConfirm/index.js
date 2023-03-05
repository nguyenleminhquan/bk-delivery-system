import React, { useState } from 'react';
import styles from './GeneralConfirm.module.scss';

/** How to use this component?
 *  - title: the title of confirmation dialog
 *  - message: the message to be displayed in the confirmation dialog
 *  - showConfirmButton: a boolean value indicating whether to show the confirm button (default is false)
 *  - confirmText: the text to be displayed on the confirm button
 *  - onConfirm: a function to be called when the user confirm the dialog
 *  - onCancel: a function to be called when the user cancels the dialog
 *  - cancelText: the text to be displayed on the cancel button
 *  - showForm: a boolean value indicating whether to show form in the body of dialog
 *  - formFields: an array of objects representing the form fields. Each object has the following properties:
 *    + name: the name of the form field
 *    + label: the label of the form field
 *    + type: the type of form field (text, email, password,...)
 *    + model: select model when type of form field is 'select'
 *  - formSubmitText: the text to be displayed on the submit button in the form
 *  - data: data send from parent to child component
 */

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
          {props.message && <span>{props.message}</span>}
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
            <button onClick={props.onConfirm} className="btn btn-medium">{props.confirmText}</button>
          }
          {props.showForm && <button onClick={handleSubmit} className="btn btn-medium ms-1">{props.formSubmitText}</button>}
        </div>
      </div>
    </div>
  );
}

export default GeneralConfirm;