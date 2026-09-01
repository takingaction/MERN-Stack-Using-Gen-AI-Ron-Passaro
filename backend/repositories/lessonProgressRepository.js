const LessonProgress = require("../models/lessonProgressModel");

const create = async (progressData) => {
    return await LessonProgress.create(progressData);
};

const findByStudentAndCourse = async (studentEmail, courseId) => {
    return await LessonProgress.find({ studentEmail, courseId });
};

const findByStudentAndLesson = async (studentEmail, lessonId) => {
    return await LessonProgress.findOne({ studentEmail, lessonId });
};

const deleteProgress = async (progressId) => {
    return await LessonProgress.findByIdAndDelete(progressId);
};

const deleteByStudentAndLesson = async (studentEmail, lessonId) => {
    return await LessonProgress.findOneAndDelete({ studentEmail, lessonId });
};

const countByCourse = async (studentEmail, courseId) => {
    return await LessonProgress.countDocuments({ studentEmail, courseId });
};

module.exports = {
    create,
    findByStudentAndCourse,
    findByStudentAndLesson,
    deleteProgress,
    deleteByStudentAndLesson,
    countByCourse
};