const User = require("../models/userModel");

const findByEmail = async (email) => {
    
    return await User.findOne({ email });
};

const saveUser = async (userData) => {
    return await User.create(userData);
};

module.exports = {
    findByEmail,
    saveUser
};