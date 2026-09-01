const Courses = require("../models/courseModel");

const findByTitle = async (title) => {
    return await Courses.findOne({ title });
};

const findById = async (id) => {
    return await Courses.findById(id);
};

const saveCourse = async (courseData) => {
    return await Courses.create(courseData);
};

const findAllCourses = async () => {
    return await Courses.find({});
};

const findByInstructorEmail = async (email) => {
    return await Courses.find({ instructor: email });
};

const update = async (id, updates) => {
    return await Courses.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: Date.now() },
        { new: true }
    );
};

const deleteById = async (id) => {
    return await Courses.findByIdAndDelete(id);
};

module.exports = {
    findByTitle,
    findById,
    saveCourse,
    findAllCourses,
    findByInstructorEmail,
    update,
    deleteById
};

