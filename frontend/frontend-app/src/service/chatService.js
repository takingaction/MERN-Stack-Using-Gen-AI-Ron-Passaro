import axios from 'axios';

let URL = "http://localhost:3000/api/chats";

export const getOrCreateRoom = async (courseId, email) => {
    try {
        let result = await axios.get(`${URL}/room/${courseId}`, {
            params: { email }
        });
        return result.data;
    } catch (error) {
        console.error("Error getting chat room:", error);
        return error.response?.data || { success: false, message: error.message };
    }
};

export const getMessages = async (courseId, email) => {
    try {
        let result = await axios.get(`${URL}/messages/${courseId}`, {
            params: { email }
        });
        return result.data;
    } catch (error) {
        console.error("Error getting messages:", error);
        return error.response?.data || { success: false, message: error.message };
    }
};

export const postMessage = async (courseId, senderEmail, message) => {
    try {
        let result = await axios.post(`${URL}/messages/${courseId}`, {
            senderEmail,
            message
        });
        return result.data;
    } catch (error) {
        console.error("Error posting message:", error);
        return error.response?.data || { success: false, message: error.message };
    }
};
