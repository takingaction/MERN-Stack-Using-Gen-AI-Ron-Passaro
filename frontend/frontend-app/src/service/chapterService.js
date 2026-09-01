import axios from 'axios';

let URL = "http://localhost:3000/api/chapters";

export const createChapter = async (courseId, title) => {
    try {
        let result = await axios.post(`${URL}/create`, { courseId, title });
        return result.data;
    } catch (error) {
        console.error("Error creating chapter:", error);
        return error.response?.data || { success: false, message: error.message };
    }
};

export const getChaptersByCourse = async (courseId) => {
    try {
        let result = await axios.get(`${URL}/course/${courseId}`);
        return result.data;
    } catch (error) {
        console.error("Error getting chapters:", error);
        return error.response?.data || { success: false, message: error.message };
    }
};

export const getChapterById = async (id) => {
    try {
        let result = await axios.get(`${URL}/get/${id}`);
        return result.data;
    } catch (error) {
        console.error("Error getting chapter:", error);
        return error.response?.data || { success: false, message: error.message };
    }
};

export const updateChapter = async (id, title) => {
    try {
        let result = await axios.put(`${URL}/update/${id}`, { title });
        return result.data;
    } catch (error) {
        console.error("Error updating chapter:", error);
        return error.response?.data || { success: false, message: error.message };
    }
};

export const reorderChapters = async (courseId, orderedIds) => {
    try {
        let result = await axios.put(`${URL}/reorder`, { courseId, orderedIds });
        return result.data;
    } catch (error) {
        console.error("Error reordering chapters:", error);
        return error.response?.data || { success: false, message: error.message };
    }
};

export const deleteChapter = async (id) => {
    try {
        let result = await axios.delete(`${URL}/delete/${id}`);
        return result.data;
    } catch (error) {
        console.error("Error deleting chapter:", error);
        return error.response?.data || { success: false, message: error.message };
    }
};