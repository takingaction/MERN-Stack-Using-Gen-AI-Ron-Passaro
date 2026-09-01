import axios from 'axios';

let URL = "http://localhost:3000/api/feedbacks";

export const submitFeedback = async (courseId, studentEmail, rating, comment) => {
    try {
        let result = await axios.post(`${URL}/`, { courseId, studentEmail, rating, comment });
        return result.data;
    } catch (error) {
        console.error("Error submitting feedback:", error);
        return error.response?.data || { success: false, message: error.message };
    }
};

export const getCourseFeedback = async (courseId) => {
    try {
        let result = await axios.get(`${URL}/course/${courseId}`);
        return result.data;
    } catch (error) {
        console.error("Error getting feedback:", error);
        return error.response?.data || { success: false, message: error.message };
    }
};

export const getAverageRating = async (courseId) => {
    try {
        let result = await axios.get(`${URL}/average/${courseId}`);
        return result.data;
    } catch (error) {
        console.error("Error getting average rating:", error);
        return error.response?.data || { success: false, message: error.message };
    }
};

export const checkHasFeedback = async (courseId, email) => {
    try {
        let result = await axios.get(`${URL}/check/${courseId}/${email}`);
        return result.data;
    } catch (error) {
        console.error("Error checking feedback:", error);
        return error.response?.data || { success: false, message: error.message };
    }
};
