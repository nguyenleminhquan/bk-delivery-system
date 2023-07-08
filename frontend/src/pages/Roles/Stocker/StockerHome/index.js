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
import moment from 'moment';
import { DATE_TIME_FORMAT } from 'utils/consts';
import { formatCurrency } from 'utils/constants';

const initData = {
  columns: [
    {
      label: 'Mã đơn hàng',
      field: 'id',
      sort: 'asc',
      width: 100
    },
    {
      label: 'Khách hàng',
      field: 'customer',
      sort: 'asc',
      width: 150
    },
    {
      label: 'Nơi đến',
      field: 'receiverAddress',
      sort: 'asc',
      width: 100
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
  rows: []
}

function StockerHome() {
  const dispatch = useDispatch();
  const { orders } = useSelector(state => state.stock);
  const { user } = useSelector(state => state.user);
  const [toggleImportPopup, setToggleImportPopup] = useState(false);
  const [data, setData] = useState(initData);

  const handleSearch = (startDate, endDate) => {
    console.log('startDate', startDate);
    console.log('endDate', endDate)
  }

  useEffect(() => {
    const rows = orders.map(order => ({
      id: order._id,
      customer: order.sender_name,
      receiverAddress: order.receiver_address,
      createdTime: moment(order.createdAt).format(DATE_TIME_FORMAT),
      totalPrice: formatCurrency(order.shipping_fee)}));
    setData({...data, rows});
  }, [orders])

  useEffect(() => {
    if (user) {
      dispatch(getStockOrders(user.stock_id));
    }
  }, [user])

  return (
    <div className='stocker-home'>
      <StockerHeader title="Tổng quan" openImportPopup={() => setToggleImportPopup(true)} />
      <div className='filter'>
        <DatePickerComp handleSearch={handleSearch} />
      </div>
      <Table data={data} />
      {toggleImportPopup && (
        <ConfirmPopup
          title="Thêm đơn hàng mới vào kho"
          content={<ImportOrder closePopup={() => setToggleImportPopup(false)} /> }
          actionNo={() => setToggleImportPopup(false)}
          // actionYes={() => handleImport()}
          cancelLabel="Hủy bỏ"
          // okLabel="Check-in"
      />
      )}
    </div>
  )
}

export default StockerHome