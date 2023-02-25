import ConfirmPopup from 'components/ConfirmPopup';
import ImportOrder from 'components/ImportOrder';
import StockerHeader from 'components/StockerHeader';
import Table from 'components/Table';
import React, { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import styles from './Stocker.module.scss'

function StockerHome() {
  const [toggleImportPopup, setToggleImportPoup] = useState(false);

  const data = {
    columns: [
      {
        label: 'Mã đơn hàng',
				field: 'id',
				sort: 'asc',
				width: 150
      },
      {
        label: 'Khách hàng',
				field: 'customer',
				sort: 'asc',
				width: 150
      },
      {
        label: 'Loại hàng',
				field: 'category',
				sort: 'asc',
				width: 150
      },
      {
        label: 'Ngày tạo',
				field: 'createdTime',
				sort: 'asc',
				width: 150
      },
      {
        label: 'Tổng giá trị',
				field: 'totalPrice',
				sort: 'asc',
				width: 150
      },
      {
        label: '',
				field: 'action',
				sort: 'asc',
				width: 150
      },
    ],
    rows: [
      {
        id: '1234561231',
        customer: 'Phuoc Tai',
        category: 'Điện tử',
        createdTime: '18/11/2022 23:22',
        totalPrice: '312.000 đ',
        action: <BsThreeDotsVertical />
      },
      {
        id: '1234561231',
        customer: 'Phuoc Tai',
        category: 'Điện tử',
        createdTime: '18/11/2022 23:22',
        totalPrice: '312.000 đ',
        action: <BsThreeDotsVertical />
      },
      {
        id: '1234561231',
        customer: 'Phuoc Tai',
        category: 'Điện tử',
        createdTime: '18/11/2022 23:22',
        totalPrice: '312.000 đ',
        action: <BsThreeDotsVertical />
      },
      {
        id: '1234561231',
        customer: 'Phuoc Tai',
        category: 'Điện tử',
        createdTime: '18/11/2022 23:22',
        totalPrice: '312.000 đ',
        action: <BsThreeDotsVertical />
      },
      {
        id: '1234561231',
        customer: 'Phuoc Tai',
        category: 'Điện tử',
        createdTime: '18/11/2022 23:22',
        totalPrice: '312.000 đ',
        action: <BsThreeDotsVertical />
      },
      {
        id: '1234561231',
        customer: 'Phuoc Tai',
        category: 'Điện tử',
        createdTime: '18/11/2022 23:22',
        totalPrice: '312.000 đ',
        action: <BsThreeDotsVertical />
      },
      {
        id: '1234561231',
        customer: 'Phuoc Tai',
        category: 'Điện tử',
        createdTime: '18/11/2022 23:22',
        totalPrice: '312.000 đ',
        action: <BsThreeDotsVertical />
      },
      {
        id: '1234561231',
        customer: 'Phuoc Tai',
        category: 'Điện tử',
        createdTime: '18/11/2022 23:22',
        totalPrice: '312.000 đ',
        action: <BsThreeDotsVertical />
      },
      {
        id: '1234561231',
        customer: 'Phuoc Tai',
        category: 'Điện tử',
        createdTime: '18/11/2022 23:22',
        totalPrice: '312.000 đ',
        action: <BsThreeDotsVertical />
      },
      {
        id: '1234561231',
        customer: 'Phuoc Tai',
        category: 'Điện tử',
        createdTime: '18/11/2022 23:22',
        totalPrice: '312.000 đ',
        action: <BsThreeDotsVertical />
      },
      {
        id: '1234561231',
        customer: 'Phuoc Tai',
        category: 'Điện tử',
        createdTime: '18/11/2022 23:22',
        totalPrice: '312.000 đ',
        action: <BsThreeDotsVertical />
      },
    ]
  }

  return (
    <div className={styles.stockerHome}>
      <StockerHeader title="Tổng quan" openImportPopup={() => setToggleImportPoup(true)} />
      <Table data={data} />
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