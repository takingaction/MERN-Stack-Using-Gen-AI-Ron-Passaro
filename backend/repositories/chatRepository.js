const ChatRoom = require("../models/chatRoomModel");
const Message = require("../models/messageModel");

const findByCourseId = async (courseId) => {
    return await ChatRoom.findOne({ courseId });
};

const create = async (courseId) => {
    return await ChatRoom.create({ courseId, participants: [] });
};

const addParticipant = async (chatRoomId, email) => {
    return await ChatRoom.findByIdAndUpdate(
        chatRoomId,
        { $addToSet: { participants: email } },
        { new: true }
    );
};

const createMessage = async (messageData) => {
    return await Message.create(messageData);
};

const getMessagesByRoomId = async (chatRoomId, limit = 100) => {
    return await Message.find({ chatRoomId })
        .sort({ timestamp: -1 })
        .limit(limit);
};

const findById = async (id) => {
    return await ChatRoom.findById(id);
};

const deleteMessagesByRoomId = async (chatRoomId) => {
    return await Message.deleteMany({ chatRoomId });
};

const deleteRoomByCourseId = async (courseId) => {
    return await ChatRoom.deleteOne({ courseId });
};

module.exports = {
    findByCourseId,
    create,
    addParticipant,
    createMessage,
    getMessagesByRoomId,
    findById,
    deleteMessagesByRoomId,
    deleteRoomByCourseId
};
