import React, { useEffect, useState } from 'react'
import './index.scss'
import { useDispatch, useSelector } from 'react-redux';
import { getExportHistory, getImportHistory } from 'features/stock/stockSlice';
import Table from 'components/Table';
import moment from 'moment';
import { FaEnvelope, FaFilePdf, FaPhone, FaUser } from 'react-icons/fa';
import ConfirmPopup from 'components/ConfirmPopup';
import IEOrders from 'components/IEOrders';
import customFetch from 'services/axios';
import Tabs from 'components/Tabs';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PDFFile from 'components/PDFFille';


const tabs = [
  {
    field: 'import',
    name: 'Lịch sử nhập',
  },
  {
    field: 'export',
    name: 'Lịch sử xuất',
  },
]

function ImportExportHistory() {
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { imexData } = useSelector((state) => state.stock);
  const [rowData, setRowData] = useState([]);
  const [togglePopup, setTogglePopup] = useState(false);
  const [orders, setOrders] = useState([]);

  const handleDownload = async(id) => {
    const data = await customFetch.get(`/exportinfo/${id}/download`);
    console.log('download data', data)
  }

  useEffect(() => {
    if (selectedTab.field === 'import') {
      dispatch(getImportHistory(user.stock_id))
    } else {
      dispatch(getExportHistory(user.stock_id))
    }
  }, [selectedTab])

  useEffect(() => {
    let cloneData = [];
    let tempData = [];
    cloneData = JSON.parse(JSON.stringify(imexData))
    console.log('importHistory', imexData)
    cloneData.map((item) => {
      let row = {};
      row.id = item._id;
      row.stocker = (
        <div>
          <p>
            <FaUser />
            {item.stocker_id?.fullname}
          </p>
          <p>
            <FaPhone />
            {item.stocker_id?.phone}
          </p>
          <p>
            <FaEnvelope />
            {item.stocker_id?.email}
          </p>
        </div>
      );
      row.time = moment(item.createdAt).format('DD-MM-YYYY HH:mm:ss');
      row.items = <p className='click-here' onClick={() => { setOrders(item.orders); setTogglePopup(true);  }}>Click vào đây để xem</p>;
      row.download = <PDFDownloadLink 
                        document={<PDFFile 
                                    type={selectedTab.field === 'import' ? 'import' : 'export'} 
                                    formId={item._id}
                                    stockerInfo={item.stocker_id} 
                                    orders={item.orders}
                                    createdAt={item.createdAt}
                                    stock={item.stock_id}
                                  />} 
                        filename="FORM">
      {({loading}) => (loading ? <button>Loading Document...</button> : <FaFilePdf className='download-icon' /> )}
      </PDFDownloadLink>
      tempData.push(row);
    })
    setRowData(tempData);
  }, [imexData])

  const tableData = {
    columns: [
      {
        label: 'Mã phiếu',
        field: 'id',
        sort: 'asc',
        width: 150
      },
      {
        label: 'Thủ kho',
        field: 'stocker',
        sort: 'asc',
        width: 270
      },
      {
        label: 'Ngày thực hiện',
        field: 'time',
        sort: 'asc',
        width: 270
      },
      {
        label: 'Các đơn hàng',
        field: 'items',
        sort: 'asc',
        width: 150
      },
      {
        label: 'In phiếu',
        field: 'download',
        width: 100
      },
    ],
    rows: rowData
  }

  return (
    <div className='import-export-history'>
      <h2 className='pb-3 fs-5'>Lịch sử nhập xuất</h2>
      <Tabs tabs={tabs} changeTab={setSelectedTab} selectedTab={selectedTab} />
      <Table data={tableData} />
      {
        togglePopup &&
        <ConfirmPopup
          title='Chi tiết các đơn hàng'
          content={<IEOrders orders={orders} />}
          actionNo={() => setTogglePopup(false)}
          cancelLabel="Đóng lại"
        />
      }
    </div>
  )
}

export default ImportExportHistory