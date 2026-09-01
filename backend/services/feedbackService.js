const feedbackRepository = require("../repositories/feedbackRepository");
const enrollmentRepository = require("../repositories/enrollmentRepository");

const submitFeedback = async (courseId, studentEmail, rating, comment) => {
    const enrollment = await enrollmentRepository.findByStudentAndCourse(studentEmail, courseId);
    if (!enrollment || enrollment.status !== "approved") {
        throw new Error("You must be enrolled in this course to submit feedback");
    }

    const existingFeedback = await feedbackRepository.findByStudentAndCourse(studentEmail, courseId);
    if (existingFeedback) {
        throw new Error("You have already submitted feedback for this course");
    }

    const feedbackData = {
        courseId,
        studentEmail,
        rating,
        comment
    };

    return await feedbackRepository.create(feedbackData);
};

const getCourseFeedback = async (courseId) => {
    return await feedbackRepository.findByCourseId(courseId);
};

const getAverageRating = async (courseId) => {
    return await feedbackRepository.findAverageByCourseId(courseId);
};

const hasFeedback = async (studentEmail, courseId) => {
    const feedback = await feedbackRepository.findByStudentAndCourse(studentEmail, courseId);
    return !!feedback;
};

module.exports = {
    submitFeedback,
    getCourseFeedback,
    getAverageRating,
    hasFeedback
};
