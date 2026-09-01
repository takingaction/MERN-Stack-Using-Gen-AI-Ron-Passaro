const chapterService = require("../services/chapterService");

const createChapter = async (req, res) => {
    try {
        const { courseId, title } = req.body;
        const chapter = await chapterService.createChapter(courseId, title);
        res.status(201).json({
            success: true,
            data: chapter,
            message: "Chapter created successfully"
        });
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message
        });
    }
};

const getChaptersByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const chapters = await chapterService.getChaptersByCourse(courseId);
        res.status(200).json({
            success: true,
            data: chapters,
            message: "Chapters retrieved successfully"
        });
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message
        });
    }
};

const getChapterById = async (req, res) => {
    try {
        const { id } = req.params;
        const chapter = await chapterService.getChapterById(id);
        if (!chapter) {
            throw new Error("Chapter not found");
        }
        res.status(200).json({
            success: true,
            data: chapter,
            message: "Chapter retrieved successfully"
        });
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message
        });
    }
};

const updateChapter = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const chapter = await chapterService.updateChapter(id, title);
        res.status(200).json({
            success: true,
            data: chapter,
            message: "Chapter updated successfully"
        });
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message
        });
    }
};

const reorderChapters = async (req, res) => {
    try {
        const { courseId, orderedIds } = req.body;
        await chapterService.reorderChapters(courseId, orderedIds);
        res.status(200).json({
            success: true,
            message: "Chapters reordered successfully"
        });
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message
        });
    }
};

const deleteChapter = async (req, res) => {
    try {
        const { id } = req.params;
        await chapterService.deleteChapter(id);
        res.status(200).json({
            success: true,
            message: "Chapter deleted successfully"
        });
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createChapter,
    getChaptersByCourse,
    getChapterById,
    updateChapter,
    reorderChapters,
    deleteChapter
};