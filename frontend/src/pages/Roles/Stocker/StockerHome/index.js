import ConfirmPopup from 'components/ConfirmPopup';
import ImportOrder from 'components/ImportOrder';
import StockerHeader from 'components/StockerHeader';
import Table from 'components/Table';
import React, { useEffect, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import './index.scss';
import { Link } from 'react-router-dom';
import { BiPencil } from 'react-icons/bi';
import { TbFileExport } from 'react-icons/tb'
import DatePickerComp from 'components/DatePickerComp';
import { useDispatch, useSelector } from 'react-redux';
import { getStockOrders } from 'features/stock/stockSlice';

function StockerHome() {
  const dispatch = useDispatch();
  const { orders } = useSelector(state => state.stock);
  const { user } = useSelector(state => state.user);
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

  const handleSearch = (startDate, endDate) => {
    console.log('startDate', startDate);
    console.log('endDate', endDate)
  }

  useEffect(() => {
    console.log(orders);
  }, [orders])

  useEffect(() => {
    if (user) {
      dispatch(getStockOrders(user.stock_id));
    }
  }, [user])

  return (
    <div className='stocker-home'>
      <StockerHeader title="Tổng quan" openImportPopup={() => setToggleImportPoup(true)} />
      <div className='filter'>
        <DatePickerComp handleSearch={handleSearch} />
      </div>
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