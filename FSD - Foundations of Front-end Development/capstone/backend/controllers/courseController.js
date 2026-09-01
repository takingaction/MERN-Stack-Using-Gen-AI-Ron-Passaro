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

const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await courseService.getCourseById(id);
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

const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { updates, requestingUser, userType } = req.body;
        const course = await courseService.updateCourse(id, updates, requestingUser, userType);
        res.status(200).json({
            success: true,
            data: course,
            message: "Course Updated Successfully"
        });
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message
        });
    }
};

const getCoursesByInstructor = async (req, res) => {
    try {
        const { email } = req.params;
        const courses = await courseService.getCoursesByInstructor(email);
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

const deleteCourse = async (req, res) => {
    try {
        console.log("Delete controller called with id:", req.params.id);
        const { id } = req.params;
        const deletedCourse = await courseService.deleteCourse(id);
        console.log("Delete successful, deletedCourse:", deletedCourse);
        res.status(200).json({
            success: true,
            data: deletedCourse,
            message: "Course Deleted Successfully"
        });
    } catch (error) {
        console.error("Delete controller error:", error);
        res.status(200).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createCourse,
    getAllCourses,
    getCourseByTitle,
    getCourseById,
    updateCourse,
    getCoursesByInstructor,
    deleteCourse
};