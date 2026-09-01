const chapterRepository = require("../repositories/chapterRepository");
const lessonRepository = require("../repositories/lessonRepository");

const createChapter = async (courseId, title) => {
    const maxOrder = await chapterRepository.findMaxOrder(courseId);
    const chapterData = {
        courseId,
        title,
        order: maxOrder + 1
    };
    return await chapterRepository.create(chapterData);
};

const getChaptersByCourse = async (courseId) => {
    return await chapterRepository.findByCourseId(courseId);
};

const getChapterById = async (id) => {
    return await chapterRepository.findById(id);
};

const updateChapter = async (id, title) => {
    return await chapterRepository.update(id, { title });
};

const reorderChapters = async (courseId, orderedIds) => {
    const updates = orderedIds.map((id, index) => {
        return chapterRepository.updateOrder(id, index);
    });
    return await Promise.all(updates);
};

const deleteChapter = async (id) => {
    const chapter = await chapterRepository.findById(id);
    if (!chapter) {
        throw new Error("Chapter not found");
    }

    await lessonRepository.deleteByChapterId(chapter._id);

    return await chapterRepository.deleteById(id);
};

const deleteChaptersByCourse = async (courseId) => {
    const chapters = await chapterRepository.findByCourseId(courseId);
    for (const chapter of chapters) {
        await lessonRepository.deleteByChapterId(chapter._id);
    }
    return await chapterRepository.deleteByCourseId(courseId);
};

module.exports = {
    createChapter,
    getChaptersByCourse,
    getChapterById,
    updateChapter,
    reorderChapters,
    deleteChapter,
    deleteChaptersByCourse
};