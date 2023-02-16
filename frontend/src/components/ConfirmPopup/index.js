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
                    <button type="button" onClick={props.actionNo}>Cancel</button>
                    <button type="button" className="btn ms-5" onClick={props.actionYes}>OK</button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmPopup