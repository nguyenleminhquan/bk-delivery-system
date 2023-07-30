import React, { useEffect, useState } from 'react'
import Table from 'components/Table';
import './index.scss'
import ConfirmPopup from 'components/ConfirmPopup';

const Response = () => {
    return (
        <div>
            <p>Nội dung</p>
            <textarea></textarea>
        </div>
    )
}

function ResolveSupportRequest() {
    const [togglePopup, setTogglePopup] = useState(false)
    const [rowData, setRowData] = useState([]);

    const tableData = {
        columns: [
            {
                label: 'Mã đơn hàng',
                field: 'order_id',
                sort: 'asc',
                width: 200
            },
            {
                label: 'Người tạo yêu cầu',
                field: 'user',
                sort: 'asc',
                width: 200
            },
            {
                label: 'Ngày tạo yêu cầu',
                field: 'date',
                sort: 'asc',
                width: 200
            },
            {
                label: 'Nội dung yêu cầu xử lí',
                field: 'request',
                sort: 'asc',
                width: 200
            },
            {
                label: 'Phản hồi',
                field: 'response',
                sort: 'asc',
                width: 200
            }
        ],
        rows: rowData
    }

    const handleSendResponse = () => {

    }

    useEffect(() => {
        setRowData([
            {
                order_id: '64c510361cf204d680132533',
                user: 'Tài xế Trần Duy Hưng',
                date: '19/07/2023',
                request: 'Hàng hóa bị hư hỏng',
                response: <p className='click-here' onClick={() => setTogglePopup(true)}>Click để phản hồi</p>
            },
            {
                order_id: '64c510361cf204d680132533',
                user: 'Thủ kho Nguyễn Thị An',
                date: '18/07/2023',
                request: 'Không để xe nội thành để vận chuyển',
                response: 'Đã yêu cầu xe ở khu vực khác đến thực hiện'
            },
            {
                order_id: '64c4d6741c0f726edefa99d2',
                user: 'Khách hàng Nguyễn Trung Trực',
                date: '15/07/2023',
                request: 'Tài xế vẫn chưa đến lấy hàng',
                response: 'Tài xế đang lấy hàng ở khu vực khác, khoảng 15 phút nữa sẽ đến lấy hàng'
            }
        ])
    }, [])

    return (
        <div className='resolve-support-request'>
            <Table data={tableData} />
            {
                togglePopup &&
                <ConfirmPopup 
                    title='Phản hồi'
                    content={<Response />}
                    actionNo={() => setTogglePopup(false)}
                    actionsYes={() => { handleSendResponse(); setTogglePopup(false) }  }
                    cancelLabel="Đóng lại"
                    okLabel="Gửi phản hồi"
                />
            }
        </div>
    )
}

export default ResolveSupportRequest