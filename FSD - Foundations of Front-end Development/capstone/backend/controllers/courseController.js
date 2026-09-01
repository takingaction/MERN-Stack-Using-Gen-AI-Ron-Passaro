const courseService = require("../services/courseService");


const createCourse = async (req, res) => {
    try {
        const { title, description, instructor, duration } = req.body;
        const newCourse = await courseService.createCourse(title, description, instructor, duration);
        res.status(201).json({
            success: true,
            data: newCourse,
            message: "Course Created Successfully"
        });
    } catch (error) {

        res.status(200).json({
            success: false,
            message: error.message
        });
    }
};

const getAllCourses = async (req, res) => {
    try {
        const courses = await courseService.getAllCourses();
        res.status(200).json({
            success: true,
            data: courses,
            message: "Courses Retrieved Successfully"
        });
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message
        });
    }
};

const getCourseByTitle = async (req, res) => {
    try {
        const { title } = req.params;   
        const course = await courseService.getCourseByTitle(title);
        res.status(200).json({
            success: true,
            data: course,
            message: "Course Retrieved Successfully"
        });
    } catch (error) {

        res.status(200).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createCourse,
    getAllCourses,
    getCourseByTitle
};