import axios from 'axios';

let URL = "http://localhost:3000/api/lessons";

export const createLesson = async (chapterId, lessonData, videoFile = null) => {
    try {
        const formData = new FormData();
        formData.append("chapterId", chapterId);
        formData.append("title", lessonData.title);
        formData.append("type", lessonData.type);
        formData.append("content", lessonData.content || "");

        if (videoFile) {
            formData.append("video", videoFile);
        }

        let result = await axios.post(`${URL}/create`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return result.data;
    } catch (error) {
        console.error("Error creating lesson:", error);
        return error.response?.data || { success: false, message: error.message };
    }
};

export const getLessonsByChapter = async (chapterId) => {
    try {
        let result = await axios.get(`${URL}/chapter/${chapterId}`);
        return result.data;
    } catch (error) {
        console.error("Error getting lessons:", error);
        return error.response?.data || { success: false, message: error.message };
    }
};

export const getLessonsByCourse = async (courseId) => {
    try {
        let result = await axios.get(`${URL}/course/${courseId}`);
        return result.data;
    } catch (error) {
        console.error("Error getting lessons:", error);
        return error.response?.data || { success: false, message: error.message };
    }
};

export const getLessonById = async (id) => {
    try {
        let result = await axios.get(`${URL}/get/${id}`);
        return result.data;
    } catch (error) {
        console.error("Error getting lesson:", error);
        return error.response?.data || { success: false, message: error.message };
    }
};

export const updateLesson = async (id, lessonData, videoFile = null) => {
    try {
        const formData = new FormData();
        formData.append("title", lessonData.title);
        formData.append("type", lessonData.type);
        formData.append("content", lessonData.content || "");

        if (videoFile) {
            formData.append("video", videoFile);
        }

        let result = await axios.put(`${URL}/update/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return result.data;
    } catch (error) {
        console.error("Error updating lesson:", error);
        return error.response?.data || { success: false, message: error.message };
    }
};

export const reorderLessons = async (chapterId, orderedIds) => {
    try {
        let result = await axios.put(`${URL}/reorder`, { chapterId, orderedIds });
        return result.data;
    } catch (error) {
        console.error("Error reordering lessons:", error);
        return error.response?.data || { success: false, message: error.message };
    }
};

export const deleteLesson = async (id) => {
    try {
        let result = await axios.delete(`${URL}/delete/${id}`);
        return result.data;
    } catch (error) {
        console.error("Error deleting lesson:", error);
        return error.response?.data || { success: false, message: error.message };
    }
};

export const getLessonVideoUrl = (id) => {
    return `${URL}/video/${id}`;
};

export const getCourseContent = async (courseId) => {
    try {
        let result = await axios.get(`${URL}/content/${courseId}`);
        return result.data;
    } catch (error) {
        console.error("Error getting course content:", error);
        return error.response?.data || { success: false, message: error.message };
    }
};