import axios from 'axios';

let URL = "http://localhost:3000/api/users";

export const getAllUsers = async () => {
    try {
        let result = await axios.get(`${URL}/all`);
        return result.data;
    } catch (error) {
        console.error("Error getting all users:", error);
        return error.response?.data || { success: false, message: error.message };
    }
};

export const getUsersByType = async (type) => {
    try {
        let result = await axios.get(`${URL}/type/${type}`);
        return result.data;
    } catch (error) {
        console.error("Error getting users by type:", error);
        return error.response?.data || { success: false, message: error.message };
    }
};
