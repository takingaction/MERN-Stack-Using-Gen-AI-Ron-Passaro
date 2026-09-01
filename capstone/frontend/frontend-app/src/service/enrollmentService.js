import axios from 'axios';

let URL = "http://localhost:3000/api/enrollments";

export const requestEnrollment = async (courseId, studentEmail) => {
    try {
        let result = await axios.post(`${URL}/request`, { courseId, studentEmail });
        return result.data;
    } catch (error) {
        console.error("Error requesting enrollment:", error);
        return error.response?.data || { success: false, message: error.message };
    }
};

export const getStudentEnrollments = async (email) => {
    try {
        let result = await axios.get(`${URL}/student/${email}`);
        return result.data;
    } catch (error) {
        console.error("Error getting student enrollments:", error);
        return error.response?.data || { success: false, message: error.message };
    }
};

export const getPendingForInstructor = async (email) => {
    try {
        let result = await axios.get(`${URL}/pending/instructor/${email}`);
        return result.data;
    } catch (error) {
        console.error("Error getting pending enrollments:", error);
        return error.response?.data || { success: false, message: error.message };
    }
};

export const approveEnrollment = async (id, instructorEmail) => {
    try {
        let result = await axios.put(`${URL}/${id}/approve`, { instructorEmail });
        return result.data;
    } catch (error) {
        console.error("Error approving enrollment:", error);
        return error.response?.data || { success: false, message: error.message };
    }
};

export const rejectEnrollment = async (id, instructorEmail) => {
    try {
        let result = await axios.put(`${URL}/${id}/reject`, { instructorEmail });
        return result.data;
    } catch (error) {
        console.error("Error rejecting enrollment:", error);
        return error.response?.data || { success: false, message: error.message };
    }
};

export const getApprovedCoursesForStudent = async (email) => {
    try {
        let result = await axios.get(`${URL}/approved/student/${email}`);
        return result.data;
    } catch (error) {
        console.error("Error getting approved courses:", error);
        return error.response?.data || { success: false, message: error.message };
    }
};
