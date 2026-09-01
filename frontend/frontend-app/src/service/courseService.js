import axios from 'axios';

let URL = "http://localhost:3000/api/courses"

export const viewCourseByTitle = async (title) => {
    try {
        let result = await axios.get(`${URL}/title/${title}`);
        return result.data;
    } catch (error) {
        console.error("Error viewing course:", error);
        return error.response?.data || { success: false, message: error.message };
    }
};

export const viewAllCourses = async () => {
    try {
        let result = await axios.get(`${URL}/all`);
        return result.data;
    } catch (error) {
        console.error("Error viewing all courses:", error);
        return error.response?.data || { success: false, message: error.message };
    }
};

export const createCourse = async (courseData) => {
    try {
        let result = await axios.post(`${URL}/create`, courseData);
        return result.data;
    } catch (error) {
        console.error("Error creating course:", error);
        return error.response?.data || { success: false, message: error.message };
    }
};

export const getCourseById = async (id) => {
    try {
        let result = await axios.get(`${URL}/get/${id}`);
        return result.data;
    } catch (error) {
        console.error("Error getting course:", error);
        return error.response?.data || { success: false, message: error.message };
    }
};

export const updateCourse = async (id, updates, requestingUser, userType) => {
    try {
        let result = await axios.put(`${URL}/update/${id}`, { updates, requestingUser, userType });
        return result.data;
    } catch (error) {
        console.error("Error updating course:", error);
        return error.response?.data || { success: false, message: error.message };
    }
};

export const getCoursesByInstructor = async (email) => {
    try {
        let result = await axios.get(`${URL}/instructor/${email}`);
        return result.data;
    } catch (error) {
        console.error("Error getting instructor courses:", error);
        return error.response?.data || { success: false, message: error.message };
    }
};

export const deleteCourse = async (id) => {
    try {
        console.log("Deleting course with id:", id);
        let result = await axios.delete(`${URL}/delete/${id}`);
        console.log("Delete response:", result);
        return result.data;
    } catch (error) {
        console.error("Error deleting course:", error);
        if (error.response) {
            console.error("Error response data:", error.response.data);
            return error.response.data;
        }
        return { success: false, message: error.message };
    }
};

