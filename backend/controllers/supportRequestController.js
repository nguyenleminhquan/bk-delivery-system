import SupportRequest from "../models/SupportRequest.js";
import createError from 'http-errors'


const getAllSupportRequest = async (req, res, next) => {
    try {
        const data = await SupportRequest.find().sort({ createdAt: -1 });
        return res.json(data);
    } catch (err) {
        console.log(err);
        return next(createError(400))
    }
}

const socketSupportRequest = (io) => {
    io.on('connection', async (socket) => {
      socket.on('disconnect', () => {
          console.log('user disconnected');
      })
      socket.on('newSupportRequest', async(data) => {
        const { requester, order, content } = data;
        let newSupportRequest = new SupportRequest({ requester, order, content });
        const res = await newSupportRequest.save();
        io.emit('newSupportRequest', res);
      })
      socket.on('replyRequest', async(data) => {
        const {id, reply} = data;
        const supportRequest = await SupportRequest.findByIdAndUpdate(id, {reply: reply}, {new: true});
        io.emit('replyRequest', supportRequest);
      })
    });
}

export { 
    getAllSupportRequest,
    socketSupportRequest
 }