import axios from 'axios';

let URL = "http://localhost:3000/api/materials";

export const uploadMaterial = async (formData) => {
    try {
        let result = await axios.post(`${URL}/upload`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return result.data;
    } catch (error) {
        console.error("Error uploading material:", error);
        return error.response?.data || { success: false, message: error.message };
    }
};

export const getMaterialsByCourse = async (courseId) => {
    try {
        let result = await axios.get(`${URL}/course/${courseId}`);
        return result.data;
    } catch (error) {
        console.error("Error getting materials:", error);
        return error.response?.data || { success: false, message: error.message };
    }
};

export const downloadMaterial = async (materialId, fileName) => {
    try {
        let result = await axios.get(`${URL}/${materialId}`, {
            responseType: "blob"
        });
        const url = window.URL.createObjectURL(new Blob([result.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        return { success: true };
    } catch (error) {
        console.error("Error downloading material:", error);
        return error.response?.data || { success: false, message: error.message };
    }
};

export const deleteMaterial = async (materialId, requestingUser, userType) => {
    try {
        let result = await axios.delete(`${URL}/${materialId}`, {
            data: { requestingUser, userType }
        });
        return result.data;
    } catch (error) {
        console.error("Error deleting material:", error);
        return error.response?.data || { success: false, message: error.message };
    }
};
