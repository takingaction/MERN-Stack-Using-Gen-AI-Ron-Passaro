const Feedback = require("../models/feedbackModel");

const create = async (feedbackData) => {
    return await Feedback.create(feedbackData);
};

const findByCourseId = async (courseId) => {
    return await Feedback.find({ courseId }).sort({ createdAt: -1 });
};

const findByStudentAndCourse = async (studentEmail, courseId) => {
    return await Feedback.findOne({ studentEmail, courseId });
};

const findAverageByCourseId = async (courseId) => {
    const result = await Feedback.aggregate([
        { $match: { courseId: courseId } },
        {
            $group: {
                _id: "$courseId",
                averageRating: { $avg: "$rating" },
                count: { $sum: 1 }
            }
        }
    ]);
    if (result.length === 0) {
        return { averageRating: 0, count: 0 };
    }
    return {
        averageRating: Math.round(result[0].averageRating * 10) / 10,
        count: result[0].count
    };
};

const deleteByCourseId = async (courseId) => {
    return await Feedback.deleteMany({ courseId });
};

module.exports = {
    create,
    findByCourseId,
    findByStudentAndCourse,
    findAverageByCourseId,
    deleteByCourseId
};
