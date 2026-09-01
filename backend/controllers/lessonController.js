const lessonService = require("../services/lessonService");

const createLesson = async (req, res) => {
    try {
        const { chapterId, title, type, content } = req.body;
        const videoFile = req.file || null;

        const lessonData = {
            chapterId,
            title,
            type,
            content: content || ""
        };

        const lesson = await lessonService.createLesson(lessonData, videoFile);
        res.status(201).json({
            success: true,
            data: lesson,
            message: "Lesson created successfully"
        });
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message
        });
    }
};

const getLessonsByChapter = async (req, res) => {
    try {
        const { chapterId } = req.params;
        const lessons = await lessonService.getLessonsByChapter(chapterId);
        res.status(200).json({
            success: true,
            data: lessons,
            message: "Lessons retrieved successfully"
        });
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message
        });
    }
};

const getLessonsByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const lessons = await lessonService.getLessonsByCourse(courseId);
        res.status(200).json({
            success: true,
            data: lessons,
            message: "Lessons retrieved successfully"
        });
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message
        });
    }
};

const getLessonById = async (req, res) => {
    try {
        const { id } = req.params;
        const lesson = await lessonService.getLessonById(id);
        if (!lesson) {
            throw new Error("Lesson not found");
        }
        res.status(200).json({
            success: true,
            data: lesson,
            message: "Lesson retrieved successfully"
        });
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message
        });
    }
};

const getLessonVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const videoInfo = await lessonService.getLessonVideo(id);

        res.set({
            "Content-Type": videoInfo.mimeType,
            "Content-Disposition": `attachment; filename="${videoInfo.fileName}"`,
            "Content-Length": videoInfo.fileSize
        });

        res.send(videoInfo.data);
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message
        });
    }
};

const updateLesson = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, type, content } = req.body;
        const videoFile = req.file || null;

        const updates = { title, type, content: content || "" };
        const lesson = await lessonService.updateLesson(id, updates, videoFile);
        res.status(200).json({
            success: true,
            data: lesson,
            message: "Lesson updated successfully"
        });
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message
        });
    }
};

const reorderLessons = async (req, res) => {
    try {
        const { chapterId, orderedIds } = req.body;
        await lessonService.reorderLessons(chapterId, orderedIds);
        res.status(200).json({
            success: true,
            message: "Lessons reordered successfully"
        });
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message
        });
    }
};

const deleteLesson = async (req, res) => {
    try {
        const { id } = req.params;
        await lessonService.deleteLesson(id);
        res.status(200).json({
            success: true,
            message: "Lesson deleted successfully"
        });
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createLesson,
    getLessonsByChapter,
    getLessonsByCourse,
    getLessonById,
    getLessonVideo,
    updateLesson,
    reorderLessons,
    deleteLesson
};