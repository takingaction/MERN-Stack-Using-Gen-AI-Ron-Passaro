const userService = require("../services/userService");

const register = async (req, res) => {
    try {
        const { email, password,typeOfUser } = req.body;
        const newUser = await userService.registerUser(email, password,typeOfUser);
        res.status(201).json({
            success: true,
            data: newUser,
            message: "User Registered Successfully"
        });
    } catch (error) {

        res.status(200).json({
            success: false,
            message: error.message
        });
    }
};

const login = async (req, res) => {

    try {
        const { email, password,typeOfUser } = req.body;
        const userType = await userService.loginUser(email, password,typeOfUser);
        res.status(200).json({
            success: true,
            message: `Logged in as ${userType}`
        });


    } catch (error) {

        res.status(200).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    register,
    login
};