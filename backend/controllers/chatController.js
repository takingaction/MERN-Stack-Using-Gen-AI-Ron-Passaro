const chatService = require("../services/chatService");

const getOrCreateRoom = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { email } = req.body;
        const chatRoom = await chatService.getOrCreateChatRoom(courseId, email);
        res.status(200).json({
            success: true,
            data: chatRoom,
            message: "Chat room retrieved successfully"
        });
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message
        });
    }
};

const getMessages = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { email } = req.query;
        const messages = await chatService.getMessages(courseId, email);
        res.status(200).json({
            success: true,
            data: messages,
            message: "Messages retrieved successfully"
        });
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message
        });
    }
};

const postMessage = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { senderEmail, message } = req.body;
        const newMessage = await chatService.postMessage(courseId, senderEmail, message);
        res.status(201).json({
            success: true,
            data: newMessage,
            message: "Message posted successfully"
        });
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getOrCreateRoom,
    getMessages,
    postMessage
};
