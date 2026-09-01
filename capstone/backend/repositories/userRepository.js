const User = require("../models/userModel");

const findByEmail = async (email) => {
    return await User.findOne({ email });
};

const saveUser = async (userData) => {
    return await User.create(userData);
};

const findAll = async () => {
    return await User.find({}, { password: 0 });
};

const findByType = async (typeOfUser) => {
    return await User.find({ typeOfUser }, { password: 0 });
};

module.exports = {
    findByEmail,
    saveUser,
    findAll,
    findByType
};