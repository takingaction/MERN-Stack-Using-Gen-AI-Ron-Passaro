import axios from 'axios';

let URL = "http://localhost:3000/api/users"

export const register = async (userData) => {
    try{    
 let result = await axios.post(`${URL}/register`, userData); 
 return result.data;  
} catch (error) {
    console.error("Error registering user:", error);
    return error.message
}
}

export const checkLoginDetails = async (credentials) => {
    try{
 let result = await axios.post(`${URL}/login`, credentials);  
 return result.data; 
} catch (error) {
    console.error("Error creating account:", error);
    return error.message
}
}

