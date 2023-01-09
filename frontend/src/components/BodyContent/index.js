import styles from './BodyContent.module.scss'
// Import for icon
import {BiSearch, BiPencil} from 'react-icons/bi'

function BodyContent() {
  return (
    <div className={styles.wrapper}>
        {/* Header */}
        <div className='d-flex'>
          <div className={styles.searchBar}>
            <BiSearch />
            <input type="text" placeholder='Nhập mã đơn hàng' className='ms-3' />
          </div>

          <button className={`btn ${styles.createBtn}`}>
            <BiPencil className='icon-left'/>
            Tạo đơn hàng
          </button>
        </div>
    </div>
  )
}

export default BodyContent