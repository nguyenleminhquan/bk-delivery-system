import styles from './ConfirmPopup.module.scss'

function ConfirmPopup(props) {
    // props contains: Title, content, OK event function
    // How to use this component?
    /**
        E.g:
        {isShown && (
            <ConfirmPopup 
                title="Cancel this order"
                content="Do you want to cancel this order?"
                actionNo={() => setIsShown(false)}
                actionYes={() => onDelete()}
            />
        )} 
    */ 
    return (
        <div className={styles.modal}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <span>{props.title}</span>
                </div>
                <div className={styles.body}>
                    {props.content}
                </div>
                <div className={styles.footer}>
                    {props.cancelLabel && <button type="button" className='btn btn-medium bg-secondary' onClick={props.actionNo}>{props.cancelLabel}</button>}
                    {props.okLabel && <button type="button" className="btn btn-medium ms-3" onClick={props.actionYes}>{props.okLabel}</button>} 
                </div>
            </div>
        </div>
    )
}

export default ConfirmPopup