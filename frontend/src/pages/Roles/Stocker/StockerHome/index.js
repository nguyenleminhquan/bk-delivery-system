import ConfirmPopup from 'components/ConfirmPopup';
import ImportOrder from 'components/ImportOrder';
import StockerHeader from 'components/StockerHeader';
import React, { useState } from 'react';
import styles from './Stocker.module.scss'

function StockerHome() {
  const [toggleImportPopup, setToggleImportPoup] = useState(false);

  return (
    <div className={styles.stockerHome}>
      <StockerHeader title="Tổng quan" openImportPopup={() => setToggleImportPoup(true)} />
      {toggleImportPopup && (
        <ConfirmPopup
          title="Thêm đơn hàng mới vào kho"
          content={<ImportOrder />}
          actionNo={() => setToggleImportPoup(false)}
          // actionYes={() => handleImport()}
          cancelLabel="Hủy bỏ"
          // okLabel="Check-in"
      />
      )}
    </div>
  )
}

export default StockerHome