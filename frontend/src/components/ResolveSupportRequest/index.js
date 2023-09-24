import React, { useContext, useEffect, useState } from 'react'
import Table from 'components/Table';
import './index.scss'
import ConfirmPopup from 'components/ConfirmPopup';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSupportRequest } from 'features/user/userSlice';
import { SocketContext } from 'index';
import moment from 'moment';

function ResolveSupportRequest() {
    const [togglePopup, setTogglePopup] = useState(false)
    const [allSupportRequests, setAllSupportRequests] = useState([]);
    const [rowData, setRowData] = useState([]);
    const [selectedItem, setSelectedItem] = useState('');
    const [reply, setReply] = useState('');
    const { supportRequests } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const socket = useContext(SocketContext);

    const tableData = {
        columns: [
            {
                label: 'Mã đơn hàng',
                field: 'order',
                sort: 'asc',
                width: 200
            },
            {
                label: 'Người tạo yêu cầu',
                field: 'requester',
                sort: 'asc',
                width: 200
            },
            {
                label: 'Ngày tạo yêu cầu',
                field: 'createdAt',
                sort: 'asc',
                width: 200
            },
            {
                label: 'Nội dung yêu cầu xử lí',
                field: 'content',
                sort: 'asc',
                width: 200
            },
            {
                label: 'Phản hồi',
                field: 'reply',
                sort: 'asc',
                width: 200
            }
        ],
        rows: rowData
    }

    const handleSendResponse = () => {
        socket.emit('replyRequest', {
            id: selectedItem,
            reply: reply
        })
    }

    useEffect(() => {
        dispatch(getAllSupportRequest());
    }, []);

    useEffect(() => {
        setAllSupportRequests(supportRequests)
    }, [supportRequests]);

    useEffect(() => {
        socket.on('newSupportRequest', (data) => {
            setAllSupportRequests([data, ...allSupportRequests]);
        })
        socket.on('replyRequest', (data) => {
            setAllSupportRequests((prevSupportRequests) => {
                console.log('prevSupport', prevSupportRequests)
                const tempSupportRequests = JSON.parse(JSON.stringify(prevSupportRequests));
                tempSupportRequests.forEach((item) => {
                    if (item._id === data._id) {
                        item.reply = data.reply
                    }
                })
                return tempSupportRequests
            })
        })
    }, [socket, allSupportRequests]);

    useEffect(() => {
        const tempSupportRequests = JSON.parse(JSON.stringify(allSupportRequests));
        tempSupportRequests.forEach((item) => {
            item.createdAt = moment(item.createdAt).format('DD-MM-YYYY HH:mm:ss');
            if (!item.reply) {
                item.reply = <p className='click-here' onClick={() => {setTogglePopup(true); setSelectedItem(item._id)}}>Click để phản hồi</p>
            }
        })
        setRowData(tempSupportRequests)
    }, [allSupportRequests])

    return (
        <div className='resolve-support-request'>
            <Table data={tableData} />
            {
                togglePopup &&
                <ConfirmPopup 
                    title='Phản hồi'
                    content={<textarea value={reply} onChange={(e) => setReply(e.target.value)}></textarea>}
                    actionNo={() => setTogglePopup(false)}
                    actionYes={() => { handleSendResponse(); setTogglePopup(false) }  }
                    cancelLabel="Đóng lại"
                    okLabel="Gửi phản hồi"
                />
            }
        </div>
    )
}

export default ResolveSupportRequest