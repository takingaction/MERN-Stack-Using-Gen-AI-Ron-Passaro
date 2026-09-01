const courseRepository = require("../repositories/courseRepository");


const createCourse = async (title, description, instructor, duration) => {
    let existingCourse = await courseRepository.findByTitle(title);
    if (existingCourse) {
        throw new Error("Course with this title already exists");
    }
    const newCourse = await courseRepository.saveCourse({ title, description, instructor, duration });
    return newCourse;
}

const getAllCourses = async () => {
    return await courseRepository.findAllCourses();
}

const getCourseByTitle = async (title) => {
    let course = await courseRepository.findByTitle(title);
    if (!course) {
        throw new Error("Course not found");
    }
    return course;
}

module.exports = {
    createCourse,
    getAllCourses,
    getCourseByTitle
};  
