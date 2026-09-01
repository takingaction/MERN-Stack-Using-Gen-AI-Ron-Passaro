const feedbackService = require("../services/feedbackService");

const submitFeedback = async (req, res) => {
    try {
        const { courseId, studentEmail, rating, comment } = req.body;
        const feedback = await feedbackService.submitFeedback(courseId, studentEmail, rating, comment);
        res.status(201).json({
            success: true,
            data: feedback,
            message: "Feedback submitted successfully"
        });
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message
        });
    }
};

const getCourseFeedback = async (req, res) => {
    try {
        const { courseId } = req.params;
        const feedback = await feedbackService.getCourseFeedback(courseId);
        res.status(200).json({
            success: true,
            data: feedback,
            message: "Feedback retrieved successfully"
        });
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message
        });
    }
};

const getAverageRating = async (req, res) => {
    try {
        const { courseId } = req.params;
        const stats = await feedbackService.getAverageRating(courseId);
        res.status(200).json({
            success: true,
            data: stats,
            message: "Average rating retrieved successfully"
        });
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message
        });
    }
};

const checkHasFeedback = async (req, res) => {
    try {
        const { courseId, email } = req.params;
        const hasFeedback = await feedbackService.hasFeedback(email, courseId);
        res.status(200).json({
            success: true,
            data: { hasFeedback },
            message: "Feedback check successful"
        });
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    submitFeedback,
    getCourseFeedback,
    getAverageRating,
    checkHasFeedback
};
