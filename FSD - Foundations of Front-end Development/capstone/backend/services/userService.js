const userRepository = require("../repositories/userRepository");
let passwordHashing = require("../middleware/passwordHashing");


const createAdminUser = async (email, password,typeOfUser) => {

    let existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
        console.log("Admin user already exists");
        return;
    }

    const hashedPassword = await passwordHashing.hashPassword(password);
    const newAdminUser = await userRepository.saveUser({ email, password: hashedPassword, typeOfUser });

    return newAdminUser;
};

const registerUser = async (email, password,typeOfUser) => {

    let existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
        throw new Error("Email already in use");
    }else if(typeOfUser === "admin"){
        throw new Error("Cannot register as admin");
    }

    const hashedPassword = await passwordHashing.hashPassword(password);
    const newUser = await userRepository.saveUser({ email, password: hashedPassword, typeOfUser });

    return newUser;
};

const loginUser = async (email, password,typeOfUser) => {

    let existingUser = await userRepository.findByEmail(email);
    console.log(existingUser);
    if (existingUser) {
        const isMatch = await passwordHashing.comparePassword(password, existingUser.password);
        console.log(isMatch);
        if (!isMatch) {
            throw new Error("Invalid password");
        }else if(existingUser.typeOfUser === "admin"){
            console.log("admin");
            return "admin";
        }else if(existingUser.typeOfUser === "student"){
            console.log("student");
            return "student";
        }else if(existingUser.typeOfUser === "instructor"){
            console.log("instructor");
            return "instructor";
        }else {
            throw new Error("Invalid user type");
        }

    } else {
        throw new Error("Invalid email");
    }
};

module.exports = {
    createAdminUser,
    registerUser,
    loginUser
};