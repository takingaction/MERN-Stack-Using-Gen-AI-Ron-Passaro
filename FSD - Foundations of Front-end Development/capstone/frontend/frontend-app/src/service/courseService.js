import axios from 'axios';

let URL = "http://localhost:3000/api/courses"

export const viewCourseByTitle = async (title) => {
    try{    
 let result = await axios.get(`${URL}/title/${title}`); 
 return result.data;  
} catch (error) {
    console.error("Error viewing course:", error);
    return error.message
}
}

export const viewAllCourses = async () => {
    try{
 let result = await axios.get(`${URL}/all`);  
 return result.data; 
} catch (error) {
    console.error("Error viewing all courses:", error);
    return error.message
}
}

export const createCourse = async (courseData) => {
    try{    
 let result = await axios.post(`${URL}/create`, courseData); 
 return result.data;  
} catch (error) {
    console.error("Error creating course:", error);
    return error.message
}
}

