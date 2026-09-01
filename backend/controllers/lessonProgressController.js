const lessonProgressService = require("../services/lessonProgressService");

const markComplete = async (req, res) => {
    try {
        const { lessonId, courseId, studentEmail } = req.body;
        const progress = await lessonProgressService.markComplete(lessonId, courseId, studentEmail);
        res.status(201).json({
            success: true,
            data: progress,
            message: "Lesson marked as complete"
        });
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message
        });
    }
};

const unmarkComplete = async (req, res) => {
    try {
        const { lessonId, studentEmail } = req.params;
        await lessonProgressService.unmarkComplete(lessonId, studentEmail);
        res.status(200).json({
            success: true,
            message: "Lesson unmarked as complete"
        });
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message
        });
    }
};

const getCourseProgress = async (req, res) => {
    try {
        const { courseId, studentEmail } = req.params;
        const progress = await lessonProgressService.getCourseProgress(courseId, studentEmail);
        res.status(200).json({
            success: true,
            data: progress,
            message: "Progress retrieved successfully"
        });
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    markComplete,
    unmarkComplete,
    getCourseProgress
};