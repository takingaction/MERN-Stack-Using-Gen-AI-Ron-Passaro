const Courses = require("../models/courseModel");

const findByTitle = async (title) => {
    
    return await Courses.findOne({ title });
};

const saveCourse = async (courseData) => {
    return await Courses.create(courseData);
};

const findAllCourses = async () => {
    return await Courses.find({});
}

module.exports = {
    findByTitle,
    saveCourse,
    findAllCourses
};

