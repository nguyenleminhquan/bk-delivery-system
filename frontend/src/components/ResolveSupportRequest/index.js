import React, { useContext, useEffect, useState } from 'react'
import Table from 'components/Table';
import './index.scss'
import ConfirmPopup from 'components/ConfirmPopup';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSupportRequest } from 'features/user/userSlice';
import { SocketContext } from 'index';
import moment from 'moment';
import { FaReply, FaTrash } from 'react-icons/fa';
import { MdAssignmentInd } from 'react-icons/md';
import AssignOrderToVehicle from 'components/AssignOrderToVehicle';
import RemoveOrderFromVehicle from 'components/RemoveOrderFromVehicle';
import GeneralConfirm from 'components/GeneralConfirm';

function ResolveSupportRequest() {
    const [toggleReplyPopup, setToggleReplyPopup] = useState(false)
    const [toggleAssignPopup, setToggleAssignPopup] = useState(false)
    const [toggleRemovePopup, setToggleRemovePopup] = useState(false)
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
                label: 'Xử lý',
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
                item.reply = (
                    <div className='icon-list'>
                        <span className='reply-icon' onClick={() => {setToggleReplyPopup(true); setSelectedItem(item)}}> <FaReply /> </span>
                        <span className='assign-icon' onClick={() => {setToggleAssignPopup(true); setSelectedItem(item)}}> <MdAssignmentInd /> </span>
                        <span className='delete-icon' onClick={() => {setToggleRemovePopup(true); setSelectedItem(item)}}> <FaTrash /> </span>
                    </div>
                )
            }
        })
        setRowData(tempSupportRequests)
    }, [allSupportRequests])

    return (
        <div className='resolve-support-request'>
            <h2 className='d-none d-sm-block pb-3 fs-5'>Yêu cầu xử lí</h2>
            <Table data={tableData} />
            {
                toggleReplyPopup &&
                <ConfirmPopup 
                    title='Phản hồi'
                    content={<textarea value={reply} onChange={(e) => setReply(e.target.value)}></textarea>}
                    actionNo={() => setToggleReplyPopup(false)}
                    actionYes={() => { handleSendResponse(); setToggleReplyPopup(false) }  }
                    cancelLabel="Đóng lại"
                    okLabel="Gửi phản hồi"
                />
            }
            {
                toggleAssignPopup &&
                <GeneralConfirm 
                    title='Gán đơn hàng cho tài xế vận chuyển'
                    message={<AssignOrderToVehicle order_id={selectedItem.order} showTitle={false} handleClose={() => setToggleAssignPopup(false)} />}
                    actionNo={() => setToggleAssignPopup(false)}
                    actionYes={() => { handleSendResponse(); setToggleAssignPopup(false) }  }
                    cancelLabel="Đóng lại"
                    okLabel="Gửi phản hồi"
                    disableCancel={true}
                />
            }
            {
                toggleRemovePopup &&
                <GeneralConfirm
                    title='Xóa đơn hàng khỏi xe tải'
                    message={<RemoveOrderFromVehicle order_id={selectedItem.order} vehicle_id={selectedItem.vehicle} handleClose={() => setToggleRemovePopup(false)} />}
                    actionNo={() => setToggleRemovePopup(false)}
                    actionYes={() => { handleSendResponse(); setToggleRemovePopup(false) }  }
                    cancelLabel="Đóng lại"
                    okLabel="Gửi phản hồi"
                    disableCancel={true}
                />
            }
        </div>
    )
}

export default ResolveSupportRequest