import axios from 'axios';

let URL = "http://localhost:3000/api/progress";

export const markLessonComplete = async (lessonId, courseId, studentEmail) => {
    try {
        let result = await axios.post(`${URL}/complete`, { lessonId, courseId, studentEmail });
        return result.data;
    } catch (error) {
        console.error("Error marking lesson complete:", error);
        return error.response?.data || { success: false, message: error.message };
    }
};

export const unmarkLessonComplete = async (lessonId, studentEmail) => {
    try {
        let result = await axios.delete(`${URL}/complete/${lessonId}/${studentEmail}`);
        return result.data;
    } catch (error) {
        console.error("Error unmarking lesson complete:", error);
        return error.response?.data || { success: false, message: error.message };
    }
};

export const getCourseProgress = async (courseId, studentEmail) => {
    try {
        let result = await axios.get(`${URL}/course/${courseId}/${studentEmail}`);
        return result.data;
    } catch (error) {
        console.error("Error getting course progress:", error);
        return error.response?.data || { success: false, message: error.message };
    }
};